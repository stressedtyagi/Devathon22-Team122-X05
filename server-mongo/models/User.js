const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 40,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    // Validator : used to match the regex with the new email entered
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    // Not a validator, just creates a unique index for every user
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 5,
  },
  type: {
    type: String,
    required: [true, "Please provide user type"],
  },
  designation: {
    type: String,
    enum: ["carpenter", "electrician", "data-center"],
    required: false,
  },
});

// Setting up middleware for mongoose, rather writing code in controllers
// Used function keyword here so that `this` keyword will always point to our document in the DB we are inserting
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // next(); <- no need to use next after mongoose 5x .. simple async/await will work
});

/*  
    Setting up jwt functionality using `instance method` of mongoose in models, rather doing it in controllers
    i.e attaching custom methods to our schema
*/
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

/*  
    Method that compares hashed password with the current password entered
*/
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
