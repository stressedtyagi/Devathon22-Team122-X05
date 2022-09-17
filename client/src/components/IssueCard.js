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
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// differnt colors for different job status
const colorMap = {
  pending: "#FFC900",
  resolving: "#00EAD3",
  resolved: "#689F38",
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
}) => (
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
      </CardContent>
      <CardActions sx={styles.cardAction}>
        <Tooltip title="Edit">
          <Button size="small" sx={styles.btn} onClick={editIssueHandler(item)}>
            EDIT
          </Button>
        </Tooltip>
        <Chip
          label={item.status.toUpperCase()}
          sx={{
            backgroundColor: colorMap[item.status],
          }}
        />
      </CardActions>
    </CardContent>
  </Grow>
);
