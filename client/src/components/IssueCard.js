import { useState, useEffect } from "react";

// mui imports
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Grow,
  Badge,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import auth from "../utils/auth";
import browserActions from "../utils/browserActions";
import { useSnackbar } from "notistack";

// differnt colors for different job status
const colorMap = {
  pending: "#FFC900",
  resolving: "#00EAD3",
  resolved: "#689F38",
};

const colorMapPrivacy = {
  true: "#FF4A4A",
  false: "#9C9EFE",
};

// styles for the job card
const styles = {
  date: {
    alignSelf: "right",
    textAlign: "right",
  },
  cardAction: {
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  btn: {
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
};

/**
 * [PROPS]
 * @param {item} state - state contains issue data component from parent
 * @param {editIssueHandler} method - edit Issue handler from parent (Dashboard)
 * @param {deleteIssueHandler} method - delete Issue handler from parent (Dashboard)
 */
export const IssueCard = ({
  item,
  type,
  editIssueHandler,
  deleteIssueHandler,
}) => {
  const [resolved, setResolved] = useState(null);
  const [upVote, setUpVote] = useState(item.upvotes || 0);

  // hook used to display snackbar notifications (mui)
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (item.resolvedBy) {
      getUser(item.resolvedBy, setResolved);
    }
  });

  const handleUpVote = async () => {
    const {
      data: { issue: updatedIssue },
    } = await auth.patch(`/api/v1/issues/${item._id}`, {
      data: {
        upvotes: upVote + 1,
      },
      token: browserActions.getLocalStorage("token"),
    });

    setUpVote(updatedIssue.upvotes);

    // on successful update show snackbar
    enqueueSnackbar("Issue updated successfully", {
      variant: "info",
      autoHideDuration: "1000",
    });
  };

  return (
    <Grow
      in={true}
      style={{
        transformOrigin: "0 0 0",
      }}
      timeout={1200}
    >
      <CardContent sx={{ backgroundColor: colorMap[item.status], padding: 0 }}>
        <CardContent sx={{ backgroundColor: "white" }}>
          {type === "student" ? (
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                size="medium"
                onClick={deleteIssueHandler(item)}
              >
                <HighlightOffIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}

          <Typography
            variant="body2"
            sx={styles.date}
            color="text.secondary"
            gutterBottom
          >
            {/* date formating */}
            {new Date(item.createdAt).toDateString("en-US")}
          </Typography>
          <Typography variant="h5" component="div">
            {item.discription.toUpperCase()}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {item.concernTo}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <b>Floor</b> : {item?.floor}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <b>Hostel Block</b> : {item?.hostelBlock}
          </Typography>
        </CardContent>
        <CardActions sx={styles.cardAction}>
          <Tooltip title="Edit">
            <Button
              size="small"
              sx={styles.btn}
              onClick={editIssueHandler(item)}
            >
              EDIT
            </Button>
          </Tooltip>
          <Chip
            label={item.isPrivate ? "Private" : "Public"}
            sx={{
              backgroundColor: colorMapPrivacy[item.isPrivate],
            }}
          />
          <Chip
            label={item.status.toUpperCase()}
            sx={{
              backgroundColor: colorMap[item.status],
            }}
          />
        </CardActions>

        {item.status === "resolved" && resolved ? (
          <Typography
            variant="h6"
            sx={styles.date}
            color="text.secondary"
            paddingRight={1}
            paddingTop={1}
          >
            Resolved By : {resolved}
          </Typography>
        ) : item.isPrivate ? (
          <></>
        ) : (
          <div
            style={{
              ...styles.date,
              paddingRight: "20px",
              paddingTop: "15px",
              paddingBottom: "0px",
            }}
          >
            <Badge color="secondary" badgeContent={upVote || 0}>
              <Tooltip title="Up Vote" placement="bottom-start">
                <IconButton color="primary" onClick={handleUpVote}>
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip>
            </Badge>
          </div>
        )}
      </CardContent>
    </Grow>
  );
};

const getUser = async (id, userUpdate) => {
  const name = await auth
    .post("/api/v1/auth/getUser", { data: { userId: id } })
    .then((res) => {
      const { name } = res.data;
      userUpdate(name);
    })
    .catch((err) => {
      console.log(err);
    });
  return name;
};
