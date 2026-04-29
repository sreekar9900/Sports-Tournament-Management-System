const express = require("express");
const {
  register,
  login,
  getCurrentUser
} = require("../services/authService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
