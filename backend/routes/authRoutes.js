const express = require("express");
const router = express.Router();

const {login,registerStudent} = require("../controllers/authController");


router.post("/login",login);
router.post("/register", registerStudent);

module.exports = router;