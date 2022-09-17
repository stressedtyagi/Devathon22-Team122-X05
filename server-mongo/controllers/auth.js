const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  /*  
        moving this code to User.js in models 
        so that we can use the middleware functionality of mongoose rather than
        writing the code here

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const tempUser = { name, email, password: hashedPassword };

        after doing this we don't need to send tempUser while creating the new user
        we can simple do the thing that we are doing earlier i.e. sending the req.body
        to mongoose create function
    */

  /* 
        Instead of this we will be using mongoose validator
        to get clean and meaningfull error messages

        if (!name || !email || !password) {
            throw new BadRequestError("Please provide name, email and password");
        } 
    */
  /* 
        bad practice, as we are storing password as it is in the database.  
        ...req.body <- using spread operator here to spread the values of req.body and inserting new document in the mongoose database
        
        const user = await User.create({ ...req.body });
    */
  const user = await User.create({ ...req.body });

  // Calling instance method defined in schema for User
  const token = user.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, type: user.type }, token });
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
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, type: user.type }, token });
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

module.exports = {
  register,
  login,
  checkAuth,
};
