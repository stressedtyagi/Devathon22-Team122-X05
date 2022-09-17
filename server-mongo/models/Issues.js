const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    discription: {
      type: String,
      required: [true, "Please provide issue discription"],
      maxlength: 40,
    },
    concernTo: {
      type: String,
      required: [true, "Please provide concerning authority"],
      maxlength: 30,
    },
    status: {
      type: String,
      enum: ["pending", "resolving", "resolved"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    resolvedBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", IssueSchema);
