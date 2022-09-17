import { Link, Typography } from "@mui/material";

/**
 * @info Component used to display the copyright information in footer
 */
function Copyright(props) {
    return (
        <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link
                color="inherit"
                href="https://github.com/stressedtyagi"
                target="_blank"
            >
                Divyanshu Tyagi
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default Copyright;
