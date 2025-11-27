const Cart = require("../models/cart.js");



const addProductIntoTheCart = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;

    const existingItem = await Cart.findOne({ cartId, productId });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json({ success: true, message: 'Product quantity increased successfully!'})
    } else {
      await Cart.create({
        cartId,
        productId,
        quantity: quantity || 1
      });
    }

    return res.status(200).json({ success: true, message: "Product added into the cart successfully!" });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



const incrementQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await Cart.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Quantity increased successfully",
      data: cartItem
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



const decrementQuantity = async (req, res) => {
  try {
    const {  productId } = req.params;

    const cartItem = await Cart.findOne({productId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

   
    if (cartItem.quantity === 1) {
      await Cart.findByIdAndDelete(cartItem._id);

      return res.status(200).json({
        success: true,
        message: "Product removed from cart"
      });
    }

    cartItem.quantity -= 1;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Quantity decreased successfully",
      data: cartItem
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



const getAllProductsAvailableInCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const items = await Cart.find({ cartId }).populate("productId");

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully!",
      data: items
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



const deteleCartProduct = async (req, res) => {
  try {
    const {  productId } = req.params;  

    const cartItem = await Cart.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    await Cart.findByIdAndDelete(cartItem._id);

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully!"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  addProductIntoTheCart,
  incrementQuantity,
  decrementQuantity,
  getAllProductsAvailableInCart,
  deteleCartProduct
};
