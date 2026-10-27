const express=require("express");
const app=express();
const db=require("./config/mongoose-connection");
const cookieParser=require("cookie-parser");
const path=require("path");
const ownersRouter=require("./routes/ownersRouter");
const usersRouter=require("./routes/usersRouter");
const productsRouter=require("./routes/productsRouter");
const indexRouter=require("./routes/index");
const expressSession=require("express-session");
const flash=require("connect-flash");


require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("./models/user-model");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.JWT_KEY || "scatch_session_secret_key",
    })
);
app.use(flash());

// Global template locals for user session, alerts, cart count
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = null;
    res.locals.cartCount = 0;
    res.locals.wishlistCount = 0;
    res.locals.currentPath = req.path;
    res.locals.isOwner = Boolean(req.session && req.session.isOwner);

    if (req.cookies && req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            const user = await userModel.findOne({ email: decoded.email }).select("-password");
            if (user) {
                req.user = user;
                res.locals.user = user;
                let count = 0;
                if (user.cart && Array.isArray(user.cart)) {
                    user.cart.forEach((item) => {
                        count += item.quantity || 1;
                    });
                }
                res.locals.cartCount = count;
                res.locals.wishlistCount = user.wishlist ? user.wishlist.length : 0;
            }
        } catch (err) {
            // invalid token
        }
    }
    next();
});

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Scatch luxury server running on http://localhost:${PORT}`);
});