const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;