const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isLoggedin = require("../middlewares/isLoggedin");
const isOwner = require("../middlewares/isOwner");
const { createBagSvg } = require("../utils/bagImages");

// Create product (Admin / Owner)
router.post("/create", isOwner, upload.single("image"), async (req, res) => {
  try {
    let {
      name,
      price,
      discount,
      category,
      description,
      stock,
      bgcolor,
      panelcolor,
      panecolor,
      textcolor,
      isFeatured,
      isNewArrival,
    } = req.body;

    const chosenPanelColor = panelcolor || panecolor || "#18181b";
    const chosenBgColor = bgcolor || "#f4f4f5";
    const chosenTextColor = textcolor || "#ffffff";

    let imageBuffer;
    if (req.file && req.file.buffer) {
      imageBuffer = req.file.buffer;
    } else {
      // Default SVG vector bag illustration
      const bagType = (category || "").toLowerCase().includes("backpack")
        ? "backpack"
        : (category || "").toLowerCase().includes("cross")
        ? "crossbody"
        : (category || "").toLowerCase().includes("duffle")
        ? "duffle"
        : (category || "").toLowerCase().includes("brief")
        ? "briefcase"
        : (category || "").toLowerCase().includes("clutch")
        ? "clutch"
        : "tote";
      imageBuffer = createBagSvg(bagType, chosenPanelColor, "#d97706");
    }

    await productModel.create({
      image: imageBuffer,
      name,
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      category: category || "Tote Bags",
      description: description || "Handcrafted with premium materials and signature design.",
      stock: Number(stock) || 15,
      bgcolor: chosenBgColor,
      panelcolor: chosenPanelColor,
      panecolor: chosenPanelColor,
      textcolor: chosenTextColor,
      isFeatured: isFeatured === "on" || isFeatured === "true" || isFeatured === true,
      isNewArrival: isNewArrival === "on" || isNewArrival === "true" || isNewArrival === true,
    });

    req.flash("success", `Product "${name}" created successfully!`);
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Error creating product: " + err.message);
    res.redirect("/owners/admin");
  }
});

// Single Product Details Page
router.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/shop");
    }

    // Related products in same category or others
    const relatedProducts = await productModel
      .find({ _id: { $ne: product._id } })
      .limit(4);

    res.render("product-details", {
      product,
      relatedProducts,
    });
  } catch (err) {
    req.flash("error", "Invalid product ID.");
    res.redirect("/shop");
  }
});

// Submit review on product
router.post("/:id/review", isLoggedin, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await productModel.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/shop");
    }

    const reviewObj = {
      name: req.user.fullname || "Verified Buyer",
      rating: Number(rating) || 5,
      comment: comment ? comment.trim() : "Exceptional luxury craftsmanship.",
      date: new Date(),
    };

    product.reviews.push(reviewObj);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();
    req.flash("success", "Thank you! Your review has been submitted.");
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    req.flash("error", "Failed to submit review: " + err.message);
    res.redirect(`/products/${req.params.id}`);
  }
});

// Delete product (Admin)
router.get("/delete/:id", isOwner, async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (product) {
      req.flash("success", `Product "${product.name}" deleted.`);
    }
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Error deleting product: " + err.message);
    res.redirect("/owners/admin");
  }
});

// Edit product (Admin)
router.post("/edit/:id", isOwner, upload.single("image"), async (req, res) => {
  try {
    let {
      name,
      price,
      discount,
      category,
      description,
      stock,
      bgcolor,
      panelcolor,
      textcolor,
    } = req.body;

    const updateData = {
      name,
      price: Number(price),
      discount: Number(discount) || 0,
      category,
      description,
      stock: Number(stock) || 0,
      bgcolor,
      panelcolor,
      panecolor: panelcolor,
      textcolor,
    };

    if (req.file && req.file.buffer) {
      updateData.image = req.file.buffer;
    }

    await productModel.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", `Product updated successfully.`);
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Failed to update product: " + err.message);
    res.redirect("/owners/admin");
  }
});

module.exports = router;