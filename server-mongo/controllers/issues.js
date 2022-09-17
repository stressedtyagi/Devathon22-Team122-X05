const Issue = require("../models/Issues");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllIssues = async (req, res) => {
  const type = req?.query?.type;
  let issues;
  if (type) {
    issues = await Issue.find({ concernTo: req?.query?.designation }).sort(
      "createdAt"
    );
  } else {
    issues = await Issue.find({ createdBy: req.user.userId }).sort("createdAt");
  }
  res.status(StatusCodes.OK).json({ issues, count: issues.length });
};

const getIssue = async (req, res) => {
  /*  
        nested destructruing
        we have url like {{URL}}/jobs/:id

        this id is passed via params in req object

        whereas due to our middleware we are getting user object which consist of userId property
    */
  const {
    user: { userId },
    params: { id: issueId },
  } = req;

  const issue = await Issue.findOne({
    _id: issueId,
    createdBy: userId,
  });

  if (!issue) {
    throw new NotFoundError(`No issue found with id ${issueId}`);
  }

  res.status(StatusCodes.OK).json({ issue });
};

const createIssue = async (req, res) => {
  req.body.createdBy = req.user.userId;
  req.body.resolvedBy = null;
  const issue = await Issue.create(req.body);
  console.log(issue);
  res.status(StatusCodes.CREATED).json({ issue });
};

const updateIssue = async (req, res) => {
  const {
    body: { discription, concernTo },
    user: { userId },
    params: { id: issueId },
  } = req;

  if (discription === " " || concernTo === " ") {
    throw new BadRequestError("Company or Concern fields cannot be empty");
  }

  const issue = await Issue.findByIdAndUpdate(
    { _id: issueId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!issue) {
    throw new NotFoundError(`No issue found with id ${issueId}`);
  }

  res.status(StatusCodes.OK).json({ issue });
};

const deleteIssue = async (req, res) => {
  const {
    user: { userId },
    params: { id: issueId },
  } = req;

  const issue = await Issue.findOneAndRemove({
    _id: issueId,
    createdBy: userId,
  });

  if (!issue) {
    throw new NotFoundError(`No issue found with id ${issueId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
};
