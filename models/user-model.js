const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      minLength: 3,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    orders: [
      {
        orderId: {
          type: String,
          required: true,
        },
        items: [
          {
            name: String,
            price: Number,
            discount: Number,
            quantity: Number,
            bgcolor: String,
            panelcolor: String,
            textcolor: String,
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "product",
            },
          },
        ],
        totalMRP: Number,
        discount: Number,
        couponDiscount: {
          type: Number,
          default: 0,
        },
        shippingFee: Number,
        platformFee: Number,
        totalAmount: Number,
        paymentMethod: {
          type: String,
          default: "Cash on Delivery",
        },
        paymentStatus: {
          type: String,
          default: "Paid",
        },
        status: {
          type: String,
          default: "Confirmed",
          enum: ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
        shippingAddress: {
          fullname: String,
          phone: String,
          street: String,
          city: String,
          state: String,
          pincode: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    contact: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    picture: String,
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);