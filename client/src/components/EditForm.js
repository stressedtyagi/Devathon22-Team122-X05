// mui imports
import {
  Grid,
  Typography,
  Container,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";

// react/other imports
import { useState } from "react";
import { useSnackbar } from "notistack";

// helpers and utils import
import auth from "../utils/auth";
import browserActions from "../utils/browserActions";
import { status } from "../helpers/issueStatus";
import { concernAuthorities } from "../helpers/concernAuthorities";

/**
 * @props {issue, state} - issue State has issue to edit and state contains data component from parent
 * @returns EditForm when we click edit btn
 */
const EditForm = ({ issue, state, type }) => {
  const [editIssue, setEditIssue] = issue;
  const [data, setData] = state;
  const [currStatus, setCurrStatus] = useState(editIssue.status);
  const [concern, setConcern] = useState(editIssue.concernTo);

  // snackbar displayed on each update of data
  const { enqueueSnackbar } = useSnackbar();

  // event handler for updating Issue status
  const handleUpdate = async (event) => {
    event.preventDefault();
    const newFormData = new FormData(event.currentTarget);
    const updates = {};
    /**
     * loop through all the keys of edit issue state
     * and check there is any change in the old data
     * and new data entered in form
     * If there is any change then add it to updates object
     * */
    for (const obj in editIssue) {
      const newData = newFormData.get(obj);
      if (newData && newData !== editIssue[obj]) {
        updates[obj] = newData;
      }
    }

    /**
     * if there is any change in status then update it
     * the call update route to server
     * */
    if (Object.keys(updates).length !== 0) {
      try {
        const {
          data: { issue: updatedIssue },
        } = await auth.patch(`/api/v1/issues/${editIssue._id}`, {
          data: {
            ...updates,
          },
          token: browserActions.getLocalStorage("token"),
        });
        const newData = data.issues.map((issue) => {
          return issue._id === updatedIssue._id ? updatedIssue : issue;
        });
        setData({ count: data.count, issues: newData });
        // on successful update show snackbar
        enqueueSnackbar("Issue updated successfully", {
          variant: "info",
          autoHideDuration: "1000",
        });
      } catch (err) {}
    }
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ background: "white", borderRadius: 1.5 }}
      >
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 3 },
            p: { xs: 2, md: 2 },
            background: "#1976d2",
            color: "white",
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
            Edit Issue
          </Typography>
        </Paper>
        <Typography variant="h6" gutterBottom>
          Issue Details
        </Typography>
        <Box component="form" onSubmit={handleUpdate}>
          {type === "student" ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  required
                  id="discription"
                  name="discription"
                  label="Discription"
                  fullWidth
                  autoComplete="cc-name"
                  variant="standard"
                  defaultValue={editIssue.discription}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  select
                  id="concernTo"
                  name="concernTo"
                  label="Concern Authority"
                  helperText="Select concern Authority"
                  fullWidth
                  value={concern}
                  onChange={(event) => setConcern(event.target.value)}
                  variant="standard"
                >
                  {/* Maping over the all possible concern authorities i.e. coming from 
                                concern authorities helper function */}
                  {concernAuthorities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id="status"
                  name="status"
                  label="Current Status"
                  helperText="Select current Issue status"
                  fullWidth
                  value={currStatus}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 2, mb: 3 }}>
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{ mt: 2, mb: 3, ml: 5 }}
                  onClick={() => setEditIssue(null)}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  disabled
                  id="discription"
                  name="discription"
                  label="Discription"
                  fullWidth
                  autoComplete="cc-name"
                  variant="standard"
                  defaultValue={editIssue.discription}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  disabled
                  id="concern"
                  name="concern"
                  label="Concern Authority"
                  fullWidth
                  autoComplete="cc-text"
                  variant="standard"
                  defaultValue={editIssue.concernTo}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  select
                  id="status"
                  name="status"
                  label="Current Status"
                  helperText="Select current Issue status"
                  fullWidth
                  value={currStatus}
                  onChange={(event) => setCurrStatus(event.target.value)}
                  variant="standard"
                >
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 2, mb: 3 }}>
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{ mt: 2, mb: 3, ml: 5 }}
                  onClick={() => setEditIssue(null)}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default EditForm;
