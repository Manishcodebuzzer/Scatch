const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");
const { seedProductsIfNeeded, ensureAdminExists } = require("../utils/seedProducts");

mongoose
  .connect(`${config.get("MONGODB_URI")}/scatch`)
  .then(async function () {
    dbgr("Connected");
    console.log("MongoDB connected to Scatch database.");
    await seedProductsIfNeeded();
    await ensureAdminExists();
  })

  .catch(function (err) {
    dbgr(err);
    console.error("MongoDB connection error:", err.message);
  });

module.exports = mongoose.connection;