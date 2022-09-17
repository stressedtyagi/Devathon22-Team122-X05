// mui imports
import {
  Card,
  Box,
  Toolbar,
  Container,
  Grid,
  Backdrop,
  SpeedDial,
  SpeedDialIcon,
  CssBaseline,
} from "@mui/material";

// other imports
import { useEffect, useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import { useSnackbar } from "notistack";

// custom components import
import Loader from "../components/Loader";
import EditForm from "../components/EditForm";
import AddForm from "../components/AddForm";
import { IssueCard } from "../components/IssueCard";
import Notification from "../components/Notification";

// helpers and utils import
import browserActions from "../utils/browserActions";
import auth from "../utils/auth";

/**
 * @prop {error,SetError} state - manages the error state that trigers custom notification
 * @prop {loading,SetLoading} state - manages the loading state that trigers custom loader
 * @prop {data,setData} state - contains all issue data that is displayed on the dashboard
 * @prop {editIssue, setEditIssue} state - contains the issue data that is being edited
 * @prop {backdrop, setBackdrop} state - turn on/off the backdrop for add new issue btn
 * @prop {token,user,login,logout} outletContext - props coming from parent component (Skeleton) using useOutletContext hook
 * @returns
 */
function Dashboard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(1);
  const [data, setData] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [token, user, login, logout] = useOutletContext();
  const [type, _] = useState(
    () => browserActions.getLocalStorage("type") || null
  );

  // hook used to display snackbar notifications (mui)
  const { enqueueSnackbar } = useSnackbar();

  // custom notification - using snackbar hook
  const notification = (data) => {
    enqueueSnackbar(data.msg, {
      variant: data.variant,
      autoHideDuration: "1000",
    });
  };

  // useEffect to fetch all issues as per user type - at initial component mount
  useEffect(function fetchInitialData() {
    if (!data) {
      let params = { token: token };
      params =
        type === "resolver"
          ? {
              ...params,
              data: {
                type,
                designation: browserActions.getLocalStorage("designation"),
              },
            }
          : params;

      auth
        .get("/api/v1/issues", params)
        .then(({ data }) => {
          setData(data);
          setLoading(0);
        })
        .catch((err) => {
          const { msg } = err.response.data;
          setError({ type: "error", msg: msg || err.response.data });
          logout();
        });
    }
  }, []);

  /**
   * @function handleDeleteIssue - handles the delete issue request
   * @param {item to be deleted} item
   * @returns null
   */
  const deleteIssueHandler = (item) => (event) => {
    event.preventDefault();
    auth
      .delete(`/api/v1/issues/${item._id}`, { token })
      .then(() => {
        // filter out the deleted issue from the data array
        const newData = data.issues.filter((itm) => itm._id !== item._id);
        // update state with new {count-1, newFilteredData}, and display notification
        setData({ count: data.count - 1, issues: newData });
        notification({
          msg: "Issue deleted successfully",
          variant: "error",
        });
      })
      .catch((err) => {
        const { msg } = err.response.data;
        setError({ type: "error", msg: msg || err.response.data });
        console.dir(err);
      });
  };

  /**
   * @function handleEditIssue - handles the edit issue request
   * @param {item to edit} item
   * @returns null
   */
  const editIssueHandler = (item) => (event) => {
    event.preventDefault();
    // set editIssue state to the item that is being edited - will render EditForm component
    setEditIssue(item);
  };

  /**
   * @function handleAddIssue - handles the add issue request
   * @param {item to be added} item
   * @returns null
   */
  const addIssueHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // get all relevent form data
    const params = {
      data: {
        discription: formData.get("discription"),
        concernTo: formData.get("concern"),
        status: formData.get("status") || "pending",
        floor: formData.get("floor"),
        hostelBlock: formData.get("hostelBlock"),
        isPrivate: formData.get("isPrivate") || false,
      },
      token,
    };

    /**
     * @description send request to add new issue
     * @response {data : issue object} - contains the new issue data
     */
    auth
      .post("/api/v1/issues", params)
      .then(({ data: { issue: newIssue } }) => {
        // updatedIssues : array of issue with new issue added. First map all present issue and then add the new issue
        const updatedIssues = data.issues.map((itm) => itm);
        updatedIssues.push(newIssue);
        setData({ count: data.count + 1, issues: updatedIssues });

        // // reset backdrop to display dashboard and then display notification
        setBackdrop(false);
        notification({
          msg: "Issue added successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        const { msg } = err.response.data;
        setError({ type: "error", msg: msg || err.response.data });
        console.dir(err);
      });
  };

  /**
   * [BUG] : By the time Dashboard is rendered `user` state remains null
   * after render state gets some value
   * i.e by making call at /dashboard ..... / route is coming even when user is authenticated
   *          -> [TEMP SOLUTION] : Added Progress Bar until the `token` state is not null
   *                              i.e UseEffect is still making asyc call to authenticate `user`
   */

  /**
   * @todo: refractor the files that handle all these issue requests calls to server
   */

  return (
    <>
      {/* user state:
                [set] : show loader until we fetch data from server
                [null] : check for token state, as maybe someone has entered random token in localStorage [authentication]
                    [token {state} : set] - maybe authentication route is still running in skeleton component - show loader 
                    [token {state} : null] - user is not logged in show home route 
                                            [this is when someone directly went to this route without 
                                            any token value on localStorage] */}
      {!user ? (
        !token ? (
          <Navigate to="/" />
        ) : (
          <Loader color="secondary" />
        )
      ) : loading ? (
        <Loader color="success" />
      ) : (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              background: "#232526" /* fallback for old browsers */,
              background:
                "-webkit-linear-gradient(to right, #232526, #414345)" /* Chrome 10-25, Safari 5.1-6 */,
              background:
                "linear-gradient(to right, #232526, #414345)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Backdrop open={backdrop} />
                {type === "student" ? (
                  <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                    }}
                    icon={
                      <SpeedDialIcon
                        // event listener for speed dial icon (+ icon) [NOT SPEED DIAL Component]
                        onClick={() => setBackdrop(!backdrop)}
                      />
                    }
                    /**
                     * [Commented to alter the default action of SpeedDial]
                     * onClose={() => setBackdrop(false)}
                     * onOpen={() => setBackdrop(true)}
                     */
                    open={backdrop}
                    direction="left"
                  >
                    <AddForm
                      state={[backdrop, setBackdrop]}
                      addIssue={addIssueHandler}
                    />
                  </SpeedDial>
                ) : (
                  <></>
                )}

                {/* check data state 
                                    [null] : check for editIssue state
                                        {editIssue state} [set] : show EditForm, send props {issue, data} states
                                        {editIssue state} [null] : check if data state has any issue or not - if not show notification
                                    [set] : map over all issues and show issue card */}
                {!data ? (
                  <Loader />
                ) : editIssue ? (
                  <EditForm
                    issue={[editIssue, setEditIssue]}
                    state={[data, setData]}
                    type={type}
                    user={user}
                  />
                ) : data.count === 0 ? (
                  <>
                    <Notification
                      type="info"
                      msg="There are no items to display"
                    />
                    <img
                      src="https://i.imgur.com/L5jHP8f.gif"
                      // [FUN] src="https://i.imgur.com/QsKU1KI.gif"
                      alt="nothing to see here"
                      width="70%"
                    />
                  </>
                ) : (
                  data.issues.map((item) => (
                    <Grid item xs={12} md={4} lg={3} key={item._id}>
                      <Card variant="outlined" sx={{ boxShadow: 3 }}>
                        <IssueCard
                          item={item}
                          type={type}
                          data={[data, setData]}
                          editIssueHandler={editIssueHandler}
                          deleteIssueHandler={deleteIssueHandler}
                        />
                      </Card>
                    </Grid>
                  ))
                )}
                {/* Completely seperate from other login, managing snackbar showing in bottom */}
                {error ? (
                  <Notification type={error.type} msg={error.msg} />
                ) : (
                  ""
                )}
              </Grid>
            </Container>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Dashboard;
