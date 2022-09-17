// mui imports
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Dialog,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Paper,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Draggable from "react-draggable";
import CancelIcon from "@mui/icons-material/Cancel";

// react/other imports
import { useEffect, useState } from "react";

// helpers and utils import
import { concernAuthorities } from "../helpers/concernAuthorities";

/**
 * @info Component used for making dialog draggable
 */
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

// Consists of all styles in page
const styles = {
  dialogTitle: {
    background: "#1565C0",
    fontWeight: "bold",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    cursor: "move",
  },
  closeIcon: {
    justifySelf: "flex-end",
  },
};

/**
 * @props {state,addIssue} props are passed from parent component
 * @param {currStatus, concern, discription} controllers Managing input value inside the form
 * @returns AddForm when we click on Spinner
 */
const AddForm = ({ state, addIssue }) => {
  const [concern, setConcern] = useState("");
  const [discription, setDiscription] = useState("");
  const [floor, setFloor] = useState("");
  const [hostelBlock, setHostelBlock] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  /**
   * @param {Backdrop} state that is passed as props from Dashboard component
   * @param {open} state manages visibility of Dialog
   */
  const [backdrop, setBackdrop] = state;
  const [open, setOpen] = useState(true);

  // Whenever backdrop is added or removed change the visibility of {open} state
  useEffect(
    function controlDialog() {
      setOpen(backdrop);
    },
    [backdrop]
  );

  // Event handler for clear button
  const clearState = () => {
    setConcern("");
    setDiscription("");
    setFloor("");
    setHostelBlock("");
    setIsPrivate(false);
  };

  // Event handler for close button
  const handleClose = () => {
    setOpen(false);
    setBackdrop(false);
  };

  // Event handler for submit button
  const handleSubmit = (event) => {
    clearState();
    addIssue(event);
  };

  return (
    <Dialog
      component="form"
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      onSubmit={handleSubmit}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle sx={{ ...styles.dialogTitle }} id="draggable-dialog-title">
        Add New Issue
        <IconButton
          sx={{ ...styles.closeIcon }}
          onClick={() => setBackdrop(false)}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText>
          Fill the following form to add new issue
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              required
              id="discription"
              name="discription"
              label="Discription"
              fullWidth
              autoComplete="cc-text"
              variant="standard"
              value={discription}
              onChange={(event) => setDiscription(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              select
              id="concern"
              name="concern"
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
              required
              id="floor"
              name="floor"
              label="Floor"
              fullWidth
              autoComplete="cc-text"
              variant="standard"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="hostelBlock"
              name="hostelBlock"
              label="Hostel Block"
              fullWidth
              autoComplete="cc-text"
              variant="standard"
              value={hostelBlock}
              onChange={(event) => setHostelBlock(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  id="isPrivate"
                  name="isPrivate"
                  value={isPrivate}
                  onChange={(event) => setIsPrivate(() => event.target.checked)}
                />
              }
              label="Private"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              disabled
              id="status"
              name="status"
              label="Current Status"
              value="pending"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 3 }}>
          Add Issue
        </Button>
        <Button
          type="button"
          variant="contained"
          sx={{ mt: 2, mb: 3, ml: 5 }}
          onClick={() => {
            clearState();
          }}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddForm;
