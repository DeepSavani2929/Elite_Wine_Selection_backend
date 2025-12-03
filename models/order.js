const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },

    contactInfo: {
      emailOrPhone: { type: String, required: true },
      subscribeToOffers: { type: Boolean, default: false },
    },

    deliveryAddress: {
      country: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String }, // optional
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    billingAddress: {
      useShippingAsBilling: { type: Boolean, default: true },
      nameOnCard: { type: String, required: true },
      address: {
        line1: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },

    cartItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        productImg: String,
        price: Number,
        quantity: Number,
      },
    ],

    payment: {
      paymentIntentId: { type: String },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      currency: { type: String, default: "USD" },
    },

    pricing: {
      subtotal: Number,
      shipping: Number,
      discount: Number,
      totalAmount: Number,
      couponCode: { type: String },
    },

    orderId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
