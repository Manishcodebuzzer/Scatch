const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isOwner = require("../middlewares/isOwner");
const { seedProductsIfNeeded } = require("../utils/seedProducts");

// Admin / Owner Login Page
router.get("/login", async (req, res) => {
  if (req.session && req.session.isOwner) {
    return res.redirect("/owners/admin");
  }
  const ownerCount = await ownerModel.countDocuments();
  res.render("owner-login", { ownerCount });
});

// Admin / Owner Login POST
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let owner = await ownerModel.findOne({ email: email.toLowerCase() });

    // Fallback convenience for initial setup if no owner exists in DB yet
    const totalOwners = await ownerModel.countDocuments();
    if (totalOwners === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password || "admin123", salt);
      owner = await ownerModel.create({
        fullname: "Store Master Admin",
        email: (email || "admin@scatch.com").toLowerCase(),
        password: hash,
        gstin: "27AAACR1234A1Z5",
      });
      req.session.isOwner = true;
      req.flash("success", "Owner account initialized! Welcome to Admin Suite.");
      return res.redirect("/owners/admin");
    }

    if (!owner) {
      req.flash("error", "Owner credentials not recognized.");
      return res.redirect("/owners/login");
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (isMatch) {
      req.session.isOwner = true;
      const token = jwt.sign(
        { email: owner.email, id: owner._id, isOwner: true },
        process.env.JWT_KEY || "scatch_secret"
      );
      res.cookie("ownerToken", token, { httpOnly: true });
      req.flash("success", `Welcome back, ${owner.fullname}!`);
      return res.redirect("/owners/admin");
    } else {
      req.flash("error", "Invalid owner password.");
      return res.redirect("/owners/login");
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/owners/login");
  }
});

// Admin / Owner Logout
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.isOwner = false;
  }
  res.clearCookie("ownerToken");
  req.flash("success", "Admin logged out successfully.");
  res.redirect("/owners/login");
});

// Create initial owner route
router.post("/create", async (req, res) => {
  try {
    let owners = await ownerModel.find();
    if (owners.length > 0 && process.env.NODE_ENV !== "development") {
      req.flash("error", "You do not have permission to create a new owner.");
      return res.redirect("/owners/login");
    }
    let { fullname, email, password, gstin } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let createdOwner = await ownerModel.create({
      fullname: fullname || "Admin",
      email: email.toLowerCase(),
      password: hash,
      gstin: gstin || "27AAACR1234A1Z5",
    });

    req.session.isOwner = true;
    req.flash("success", "Owner account created successfully!");
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/owners/login");
  }
});

// Complete Admin Dashboard
router.get("/admin", isOwner, async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    const users = await userModel.find().select("-password");

    // Gather all customer orders
    let allOrders = [];
    users.forEach((u) => {
      if (u.orders && u.orders.length > 0) {
        u.orders.forEach((ord) => {
          allOrders.push({
            ...ord.toObject(),
            userEmail: u.email,
            userName: u.fullname,
          });
        });
      }
    });

    // Sort orders newest first
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate analytics
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalProducts = products.length;
    const totalOrders = allOrders.length;
    const totalCustomers = users.length;

    const stats = {
      totalRevenue,
      totalProducts,
      totalOrders,
      totalCustomers,
    };

    const tab = req.query.tab || "overview";

    res.render("admin", {
      products,
      orders: allOrders,
      stats,
      tab,
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
});

// Update order status
router.post("/order-status/:orderId", isOwner, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    await userModel.updateOne(
      { "orders.orderId": orderId },
      { $set: { "orders.$.status": status } }
    );

    req.flash("success", `Order #${orderId} status updated to ${status}.`);
    res.redirect("/owners/admin?tab=orders");
  } catch (err) {
    req.flash("error", "Failed to update order status: " + err.message);
    res.redirect("/owners/admin?tab=orders");
  }
});

// Trigger seed luxury products
router.get("/seed", isOwner, async (req, res) => {
  try {
    await seedProductsIfNeeded();
    req.flash("success", "Catalog loaded with luxury products.");
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Seeding error: " + err.message);
    res.redirect("/owners/admin");
  }
});

// Delete all products (clean reset)
router.get("/delete-all", isOwner, async (req, res) => {
  try {
    await productModel.deleteMany({});
    req.flash("success", "All products have been cleared.");
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Error: " + err.message);
    res.redirect("/owners/admin");
  }
});

module.exports = router;