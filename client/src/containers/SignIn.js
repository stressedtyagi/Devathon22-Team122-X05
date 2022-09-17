// mui imports
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  Stack,
  Switch,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// other package imports
import { useState } from "react";
import { Navigate, useOutletContext } from "react-router";

// Helper/utils Imports
import browserActions from "../utils/browserActions";
import auth from "../utils/auth";

/**
 * @param {error,setError} state - error state to manages error messages in the form
 * @param {token,user,login,logout} OutletContext - outlet context coming from parent(Skeleton.js) component to manage user authentication
 */
function SignIn() {
  const [error, setError] = useState("");
  const [type, setType] = useState("student");
  const [token, user, login, logout] = useOutletContext();

  /**
   * @note did a trick here while implementing rememberMe functionality
   * added a key['expiry'] in localStorage with value as current time + 10hrs
   * now if we try to comeback after 10 hrs the system will automatically logout us
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe");
    const data = { email, password, type };
    console.log(data);

    auth
      .post("/api/v1/auth/login", { data })
      .then((response) => {
        const token = response?.data?.token;

        if (token) {
          if (rememberMe) {
            // [rememberMe : True]  remove previous expiry key if present, as it might conflict with new expiry key
            browserActions.removeLocalStorage("expiry");
          } else {
            // [rememberMe : False] set expiry key to current time + 10hrs
            const now = new Date();
            now.setHours(now.getHours() + 10);
            browserActions.removeLocalStorage("expiry");
            browserActions.setLocalStorage("expiry", now.getTime());
          }
          // set token in localStorage
          const accessToken = "Bearer " + token;
          browserActions.setLocalStorage("token", accessToken);

          // ! [Temp] Setting up localStoreage Varible for type
          const type = response?.data?.user?.type;
          browserActions.removeLocalStorage("type");
          browserActions.setLocalStorage("type", type);

          login(accessToken);
        }
      })
      .catch((error) => {
        setError(error.response.data.msg);
      });
  };

  // ? To handle toggle change
  const handleChange = (event) => {
    setType(() => (!event.target.checked ? "student" : "resolver"));
  };

  return (
    <Box
      style={{
        border: "0.1px solid black",
        minHeight: "100vh",
        background: "#ECE9E6" /* fallback for old browsers */,
        background:
          "-webkit-linear-gradient(to right, #FFFFFF, #ECE9E6)" /* Chrome 10-25, Safari 5.1-6 */,
        background:
          "linear-gradient(to right, #FFFFFF, #ECE9E6)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      }}
    >
      {/* If there is `user` object then navigate to dashboard otherwise show signIn form */}
      {user ? (
        <Navigate to="/dashboard" />
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* There error alert of login form is managed here */}
            {error ? (
              <Alert
                severity="error"
                onClose={() => {
                  setError("");
                }}
              >
                {error}
              </Alert>
            ) : (
              ""
            )}
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox color="primary" name="rememberMe" id="rememberMe" />
                }
                label="Remember me"
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Student</Typography>
                <Switch id="type" onChange={handleChange} />
                <Typography>Resolver</Typography>
              </Stack>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signup" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
}

export default SignIn;
