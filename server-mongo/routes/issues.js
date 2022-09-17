const express = require("express");
const router = express.Router();

const {
  getAllIssues,
  getIssue,
  updateIssue,
  createIssue,
  deleteIssue,
} = require("../controllers/issues");

router.route("/").post(createIssue).get(getAllIssues);
router.route("/:id").patch(updateIssue).get(getIssue).delete(deleteIssue);

module.exports = router;
