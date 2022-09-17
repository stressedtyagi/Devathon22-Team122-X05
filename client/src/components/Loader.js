import { Backdrop, CircularProgress, Stack } from "@mui/material";

// Custom loader for loading screen
const Loader = (props) => {
    return (
        <Stack alignItems="center" height="100vh" justifyContent="center">
            <Backdrop open={true} sx={{ color: "#fff" }}>
                <CircularProgress size={80} {...props} />
            </Backdrop>
        </Stack>
    );
};

export default Loader;
