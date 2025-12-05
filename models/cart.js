const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: false,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.index(
  { cartId: 1 },
  {
    unique: true,
    partialFilterExpression: { cartId: { $exists: true } },
  }
);

module.exports = mongoose.model("cart", cartSchema);
