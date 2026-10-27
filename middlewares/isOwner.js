const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owners-model");

module.exports = async function (req, res, next) {
  // If owner logged in via session
  if (req.session && req.session.isOwner) {
    res.locals.isOwner = true;
    return next();
  }

  // Check ownerToken cookie
  if (req.cookies && req.cookies.ownerToken) {
    try {
      const decoded = jwt.verify(req.cookies.ownerToken, process.env.JWT_KEY);
      const owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
      if (owner) {
        req.owner = owner;
        res.locals.owner = owner;
        res.locals.isOwner = true;
        return next();
      }
    } catch (err) {
      res.clearCookie("ownerToken");
    }
  }

  // If in development mode and no owner exists yet, allow initial setup
  if (process.env.NODE_ENV === "development") {
    const owners = await ownerModel.find();
    if (owners.length === 0) {
      return next();
    }
  }

  req.flash("error", "Owner login required to access Admin Dashboard.");
  res.redirect("/owners/login");
};
