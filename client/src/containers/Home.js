import { CssBaseline, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TypeWriter from "typewriter-effect";
import "@fontsource/roboto-mono";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "black",
    // backgroundImage: `url(${
    //   process.env.PUBLIC_URL + "/assets/home-3-blur.jpg"
    // })`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    fontSize: "150px",
    fontFamily: "Roboto Mono",
    color: "#F0DDD7",
  },
}));

// Static home page
const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid
        container
        item
        direction="column"
        style={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          container
          direction="column"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgb(0,0,0)",
            backgroundColor: "rgba(0,0,0, 0.4)",
            zIndex: "2",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -10%)",
            width: "80%",
          }}
        >
          <TypeWriter
            options={{
              strings: ["Hostel", "Resolver", "HostRes"],
              autoStart: true,
              loop: true,
            }}
          />
          <Typography
            gutterBottom
            variant="h6"
            style={{ fontFamily: "Roboto Mono" }}
          >
            Best issue tracking system out there
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
