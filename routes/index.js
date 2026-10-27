const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

// Home / Landing Page
router.get("/", async function (req, res) {
  // If user is already logged in, redirect to shop
  if (req.user) {
    return res.redirect("/shop");
  }
  const featuredProducts = await productModel.find({ isFeatured: true }).limit(4);
  res.render("index", { featuredProducts });
});

// Shop Page with Advanced Filtering, Sorting & Search
router.get("/shop", async function (req, res) {
  try {
    let query = {};
    const { search, category, sortby, filter } = req.query;

    // Search query
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All" && category.trim() !== "") {
      query.category = category;
    }

    // Specific filters
    if (filter === "discount") {
      query.discount = { $gt: 0 };
    } else if (filter === "instock") {
      query.stock = { $gt: 0 };
    } else if (filter === "new") {
      query.isNewArrival = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortby === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sortby === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sortby === "discount") {
      sortOptions = { discount: -1 };
    } else if (sortby === "popular") {
      sortOptions = { rating: -1 };
    } else if (sortby === "newest") {
      sortOptions = { createdAt: -1 };
    }

    const products = await productModel.find(query).sort(sortOptions);
    const allCategories = await productModel.distinct("category");

    res.render("shop", {
      products,
      categories: allCategories,
      activeCategory: category || "All",
      activeSort: sortby || "popular",
      activeSearch: search || "",
      activeFilter: filter || "",
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Wishlist Page
router.get("/wishlist", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("wishlist");
    res.render("wishlist", {
      wishlistItems: user.wishlist || [],
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Toggle Wishlist Item
router.get("/wishlist/toggle/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const productId = req.params.id;

    const index = user.wishlist.indexOf(productId);
    let message = "";
    if (index > -1) {
      user.wishlist.splice(index, 1);
      message = "Removed from your Wishlist.";
    } else {
      user.wishlist.push(productId);
      message = "Saved to your Wishlist!";
    }

    await user.save();
    req.flash("success", message);
    const returnUrl = req.headers.referer || "/shop";
    res.redirect(returnUrl);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Cart Page
router.get("/cart", isLoggedin, async function (req, res) {
  try {
    const user = await userModel.findById(req.user._id).populate("cart.product");

    // Clean up null products (e.g. if product was deleted)
    const validCart = user.cart.filter((item) => item.product !== null);
    if (validCart.length !== user.cart.length) {
      user.cart = validCart;
      await user.save();
    }

    // Calculations
    let totalMRP = 0;
    let totalDiscount = 0;

    user.cart.forEach((item) => {
      const p = item.product;
      const qty = item.quantity || 1;
      totalMRP += p.price * qty;
      totalDiscount += (p.discount || 0) * qty;
    });

    const coupon = req.session.coupon || null;
    let couponDiscount = 0;
    if (coupon) {
      couponDiscount = coupon.discountAmount;
    }

    const platformFee = user.cart.length > 0 ? 20 : 0;
    const shippingFee = totalMRP - totalDiscount >= 1500 || user.cart.length === 0 ? 0 : 150;
    const netTotal = Math.max(0, totalMRP - totalDiscount - couponDiscount + platformFee + shippingFee);

    res.render("cart", {
      cartItems: user.cart,
      totalMRP,
      totalDiscount,
      coupon,
      couponDiscount,
      platformFee,
      shippingFee,
      netTotal,
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Add to Cart
router.get("/cart/add/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/shop");
    }

    // Check if product already in cart
    const existingIndex = user.cart.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();
    req.flash("success", `Added "${product.name}" to your shopping bag.`);

    // If redirected from details or shop
    const returnUrl = req.query.redirect === "cart" ? "/cart" : req.headers.referer || "/shop";
    res.redirect(returnUrl);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Increase Quantity in Cart
router.get("/cart/increase/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const item = user.cart.find(
      (item) => item.product && item.product.toString() === req.params.id
    );
    if (item) {
      item.quantity += 1;
      await user.save();
    }
    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

// Decrease Quantity in Cart
router.get("/cart/decrease/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      (item) => item.product && item.product.toString() === req.params.id
    );

    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        user.cart.splice(itemIndex, 1);
      }
      await user.save();
    }
    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

// Remove item from Cart
router.get("/cart/remove/:id", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.product && item.product.toString() !== req.params.id
    );
    await user.save();
    req.flash("success", "Item removed from cart.");
    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

// Apply Coupon Code
router.post("/cart/coupon", isLoggedin, async (req, res) => {
  try {
    const { code } = req.body;
    const cleanCode = (code || "").trim().toUpperCase();

    const user = await userModel.findById(req.user._id).populate("cart.product");
    let totalMRP = 0;
    user.cart.forEach((i) => {
      totalMRP += i.product.price * (i.quantity || 1);
    });

    if (cleanCode === "SCATCH10") {
      const discount = Math.round(totalMRP * 0.1);
      req.session.coupon = { code: cleanCode, discountAmount: discount };
      req.flash("success", `Coupon SCATCH10 applied! You saved ₹${discount}.`);
    } else if (cleanCode === "LUXURY20") {
      const discount = Math.round(totalMRP * 0.2);
      req.session.coupon = { code: cleanCode, discountAmount: discount };
      req.flash("success", `VIP Coupon LUXURY20 applied! You saved ₹${discount}.`);
    } else if (cleanCode === "WELCOME500") {
      const discount = Math.min(500, totalMRP);
      req.session.coupon = { code: cleanCode, discountAmount: discount };
      req.flash("success", `Coupon WELCOME500 applied! Flat ₹500 off.`);
    } else {
      req.flash("error", "Invalid or expired promo code. Try SCATCH10 or WELCOME500.");
    }

    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

// Remove Coupon
router.get("/cart/remove-coupon", isLoggedin, (req, res) => {
  req.session.coupon = null;
  req.flash("success", "Coupon removed.");
  res.redirect("/cart");
});

// Checkout Page
router.get("/checkout", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      req.flash("error", "Your bag is empty. Please add items to checkout.");
      return res.redirect("/shop");
    }

    let totalMRP = 0;
    let totalDiscount = 0;

    user.cart.forEach((item) => {
      totalMRP += item.product.price * (item.quantity || 1);
      totalDiscount += (item.product.discount || 0) * (item.quantity || 1);
    });

    const coupon = req.session.coupon || null;
    const couponDiscount = coupon ? coupon.discountAmount : 0;
    const platformFee = 20;
    const shippingFee = totalMRP - totalDiscount >= 1500 ? 0 : 150;
    const netTotal = Math.max(0, totalMRP - totalDiscount - couponDiscount + platformFee + shippingFee);

    res.render("checkout", {
      user,
      cartItems: user.cart,
      totalMRP,
      totalDiscount,
      coupon,
      couponDiscount,
      platformFee,
      shippingFee,
      netTotal,
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

// Place Order
router.post("/order/place", isLoggedin, async (req, res) => {
  try {
    const { fullname, phone, street, city, state, pincode, paymentMethod } = req.body;
    const user = await userModel.findById(req.user._id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/shop");
    }

    let totalMRP = 0;
    let totalDiscount = 0;
    const orderItems = [];

    for (const item of user.cart) {
      const p = item.product;
      const qty = item.quantity || 1;
      totalMRP += p.price * qty;
      totalDiscount += (p.discount || 0) * qty;

      orderItems.push({
        name: p.name,
        price: p.price,
        discount: p.discount,
        quantity: qty,
        bgcolor: p.bgcolor,
        panelcolor: p.panelcolor,
        textcolor: p.textcolor,
        productId: p._id,
      });

      // Reduce product stock
      await productModel.findByIdAndUpdate(p._id, {
        $inc: { stock: -qty },
      });
    }

    const coupon = req.session.coupon || null;
    const couponDiscount = coupon ? coupon.discountAmount : 0;
    const platformFee = 20;
    const shippingFee = totalMRP - totalDiscount >= 1500 ? 0 : 150;
    const netTotal = Math.max(0, totalMRP - totalDiscount - couponDiscount + platformFee + shippingFee);

    const orderId = `SCATCH-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      orderId,
      items: orderItems,
      totalMRP,
      discount: totalDiscount,
      couponDiscount,
      shippingFee,
      platformFee,
      totalAmount: netTotal,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending (COD)" : "Paid",
      status: "Confirmed",
      shippingAddress: {
        fullname: fullname || user.fullname,
        phone: phone || user.contact || "N/A",
        street,
        city,
        state,
        pincode,
      },
      createdAt: new Date(),
    };

    user.orders.unshift(newOrder);

    // Save updated default address
    user.address = { street, city, state, pincode };
    if (phone) user.contact = phone;

    // Empty cart
    user.cart = [];
    await user.save();

    // Clear coupon
    req.session.coupon = null;

    req.flash("success", `Order placed successfully! Order ID: #${orderId}`);
    res.redirect(`/order/success/${orderId}`);
  } catch (err) {
    req.flash("error", "Failed to place order: " + err.message);
    res.redirect("/checkout");
  }
});

// Order Confirmation Page
router.get("/order/success/:orderId", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const order = user.orders.find((o) => o.orderId === req.params.orderId);

    if (!order) {
      req.flash("error", "Order receipt not found.");
      return res.redirect("/my-orders");
    }

    res.render("order-success", { order });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// My Orders History Page
router.get("/my-orders", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.render("orders", {
      orders: user.orders || [],
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// User Account & Profile Page
router.get("/account", isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.render("account", { user });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

// Logout
router.get("/logout", isLoggedin, function (req, res) {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
});

module.exports = router;
