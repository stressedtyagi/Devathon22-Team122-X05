// mui imports
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// react/other imports
import { useState, forwardRef } from "react";

// Custom alert using snackbar mui
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({ type, msg }) {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={type}
                    sx={{ width: "100%" }}
                >
                    {msg}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
