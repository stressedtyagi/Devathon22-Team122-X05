require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Swagger setup
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
const authMiddleware = require("./middleware/authentication");

// connect DB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/auth");
const issuesRouter = require("./routes/issues");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
app.set("trust proxy", 1);
// app.use(
//     rateLimiter({
//         windowMs: 15 * 60 * 100, // 15 minutes timer
//         max: 200, // maximum 100 IP request per windowsMs
//     })
// );
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Base Route
app.get("/", (req, res) => {
  res.send("<h1> HostRes API </h1> <a href='/api-docs'>API Documentation</a>");
});

// Swagger docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/issues", authMiddleware, issuesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then((res) => {
      console.log("DB CONNECTED");
    });
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
