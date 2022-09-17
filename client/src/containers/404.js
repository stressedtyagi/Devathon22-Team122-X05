import { Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import "../style.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto-mono";

// 404 notFound page
const Page404 = () => {
    const navigator = useNavigate();
    return (
        <Container>
            <Grid
                container
                direction="row"
                height="100vh"
                justifyContent="center"
                alignItems="center"
                position="relative"
            >
                <Grid
                    item
                    container
                    xs={12}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant="h1"
                        className="title-404"
                        fontFamily="Roboto Mono"
                    >
                        404
                    </Typography>
                    <img
                        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                        alt="loading..."
                        width="100%"
                    />
                    <Typography
                        gutterBottom
                        variant="body1"
                        textAlign="center"
                        className="discription-404"
                        fontFamily="Roboto Mono"
                    >
                        Look like you're lost the page you are looking for not
                        available!
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        className="btn-404"
                        fontFamily="Roboto Mono"
                        onClick={() => navigator("/")}
                    >
                        Go to Home
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Page404;
