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
// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     cartId: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "auth",
//       required: false,
//     },

//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "product",
//       required: true,
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       default: 1,
//     },
//   },
//   { timestamps: true }
// );

// cartSchema.index({ cartId: 1, productId: 1 }, { unique: true });

// const Cart = mongoose.model("cart", cartSchema);
// module.exports = Cart;

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
    cartId: { type: String, required: true, unique: true, index: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      default: null,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.index({ cartId: 1 });

module.exports = mongoose.model("cart", cartSchema);
