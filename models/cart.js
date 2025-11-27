// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     cartId: {
//       type: String,
//       required: true
//     },

//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "product",
//       required: true
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       default: 1
//     }
//   },
//   { timestamps: true }
// );

// const Cart = mongoose.model("cart", cartSchema);
// module.exports = Cart;




// models/cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: false // optional for guest carts
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
}, { timestamps: true });


cartSchema.index({ cartId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
