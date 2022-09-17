const express = require("express");
const router = express.Router();

const { login, register, checkAuth, getUser } = require("../controllers/auth");

router.post("/", checkAuth);
router.post("/getUser", getUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
