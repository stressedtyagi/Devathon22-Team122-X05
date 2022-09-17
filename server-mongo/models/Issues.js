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
    floor: {
      type: String,
      required: [true, "Please provide floor number"],
      default: "G",
    },
    hostelBlock: {
      type: String,
      required: [true, "Please provide hostel block"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      required: false,
      default: 0,
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
