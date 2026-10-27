const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      req.flash("error", "All fields are required");
      return res.redirect("/");
    }

    let user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      req.flash("error", "An account with this email already exists. Please login.");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let createdUser = await userModel.create({
      email: email.toLowerCase(),
      password: hash,
      fullname,
    });

    let token = generateToken(createdUser);
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    req.flash("success", `Welcome to Scatch, ${createdUser.fullname}!`);
    return res.redirect("/shop");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/");
    }

    let user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = generateToken(user);
      res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      req.flash("success", `Welcome back, ${user.fullname}!`);
      return res.redirect("/shop");
    } else {
      req.flash("error", "Email or password is incorrect");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
};

module.exports.logout = function (req, res) {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
};

module.exports.updateProfile = async function (req, res) {
  try {
    let { fullname, contact, street, city, state, pincode } = req.body;
    await userModel.findByIdAndUpdate(req.user._id, {
      fullname,
      contact,
      address: {
        street,
        city,
        state,
        pincode,
      },
    });
    req.flash("success", "Profile updated successfully!");
    res.redirect("/account");
  } catch (err) {
    req.flash("error", "Failed to update profile: " + err.message);
    res.redirect("/account");
  }
};