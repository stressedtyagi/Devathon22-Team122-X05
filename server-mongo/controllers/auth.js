const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  // Calling instance method defined in schema for User
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      type: user.type,
      designation: user?.designation,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password, type } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email, type });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  /* 
        Compare the password method is written in User models
    */
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      type: user.type,
      designation: user?.designation,
    },
    token,
  });
};

const checkAuth = async (req, res) => {
  /**
   * Method just to check authenticity of the token provided by client
   */
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Token not provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json(payload);
  } catch (err) {
    throw new UnauthenticatedError("Unauthorized access");
  }
};

const getUser = async (req, res) => {
  const userData = await User.findOne({ _id: req.body.userId });
  res.status(StatusCodes.OK).json(userData);
};

module.exports = {
  register,
  login,
  checkAuth,
  getUser,
};
