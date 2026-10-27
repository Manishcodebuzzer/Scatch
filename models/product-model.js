const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    image: Buffer,
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    bgcolor: {
      type: String,
      default: "#f4f4f5",
    },
    panelcolor: {
      type: String,
      default: "#18181b",
    },
    panecolor: {
      type: String,
      default: "#18181b",
    },
    textcolor: {
      type: String,
      default: "#ffffff",
    },
    category: {
      type: String,
      default: "Tote Bags",
      trim: true,
    },
    description: {
      type: String,
      default: "Handcrafted with premium materials, designed for timeless elegance and everyday utility.",
    },
    stock: {
      type: Number,
      default: 15,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviews: [
      {
        name: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);

