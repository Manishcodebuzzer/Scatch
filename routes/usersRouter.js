const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const {
  registerUser,
  loginUser,
  logout,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/profile", isLoggedin, updateProfile);

module.exports = router;