const express = require("express");
const userController = require("./user.controller");
const router = express.Router();

router.post("/login", userController.login);

module.exports = router;
