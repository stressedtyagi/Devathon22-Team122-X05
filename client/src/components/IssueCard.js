import { useState } from "react";

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
import auth from "../utils/auth";
import { fontWeight } from "@mui/system";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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
  useState(() => {
    if (item.resolvedBy) {
      getUser(item.resolvedBy, setResolved);
    }
  });
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
        <Badge
          color="secondary"
          badgeContent={3}
          sx={{ alignSelf: "left", textAlign: "left" }}
        >
          <ArrowUpwardIcon />
        </Badge>
        {item.status === "resolved" && resolved ? (
          <Typography
            variant="h6"
            sx={styles.date}
            color="text.secondary"
            paddingRight={1}
          >
            Resolved By : {resolved}
          </Typography>
        ) : (
          <></>
        )}
      </CardContent>
    </Grow>
  );
};

const getUser = async (id, setResolved) => {
  const name = await auth
    .post("/api/v1/auth/getUser", { data: { userId: id } })
    .then((res) => {
      console.log(res);
      const { name } = res.data;
      setResolved(name);
    })
    .catch((err) => {
      console.log(err);
    });
  return name;
};
