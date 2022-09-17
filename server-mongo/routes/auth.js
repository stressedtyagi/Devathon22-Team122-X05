const express = require("express");
const router = express.Router();

const { login, register, checkAuth } = require("../controllers/auth");

router.post("/", checkAuth);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
