const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Token not provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;
    // Attaching userId here, so that this can be used in all of the routes of job controller
    // to access the user details who created the job
    req.user = { userId, name };

    next();
  } catch (err) {
    throw new UnauthenticatedError("Unauthorized access");
  }
};

module.exports = authMiddleware;
