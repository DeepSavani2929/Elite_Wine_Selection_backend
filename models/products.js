const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: null,
    },

    productImg: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    variety: {
      type: String,
      required: true,
    },

  

    price: {
      type: Number,
      required: true,
    },

    medal: {
      type: Boolean,
      default: false,
    },

    flavour: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "Extra Large"],
      required: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    categoryType: {
      type: String,
      enum: ["Popular", "Featured", "New Arrivals"],
      required: true,
    },

  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema)
module.exports = product; 
