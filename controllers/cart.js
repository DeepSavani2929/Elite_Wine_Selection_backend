// const Cart = require("../models/cart.js");



// const addProductIntoTheCart = async (req, res) => {
//   try {
//     const { cartId, productId, quantity } = req.body;

//     const existingItem = await Cart.findOne({ cartId, productId });

//     if (existingItem) {
//       existingItem.quantity += quantity || 1;
//       await existingItem.save();
//       return res.status(200).json({ success: true, message: 'Product quantity increased successfully!'})
//     } else {
//       await Cart.create({
//         cartId,
//         productId,
//         quantity: quantity || 1
//       });
//     }

//     return res.status(200).json({ success: true, message: "Product added into the cart successfully!" });

//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };



// const incrementQuantity = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const cartItem = await Cart.findOne({ productId });

//     if (!cartItem) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart item not found"
//       });
//     }

//     cartItem.quantity += 1;
//     await cartItem.save();

//     return res.status(200).json({
//       success: true,
//       message: "Quantity increased successfully",
//       data: cartItem
//     });

//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };



// const decrementQuantity = async (req, res) => {
//   try {
//     const {  productId } = req.params;

//     const cartItem = await Cart.findOne({productId });

//     if (!cartItem) {
//       return res.status(404).json({ success: false, message: "Cart item not found" });
//     }

   
//     if (cartItem.quantity === 1) {
//       await Cart.findByIdAndDelete(cartItem._id);

//       return res.status(200).json({
//         success: true,
//         message: "Product removed from cart"
//       });
//     }

//     cartItem.quantity -= 1;
//     await cartItem.save();

//     return res.status(200).json({
//       success: true,
//       message: "Quantity decreased successfully",
//       data: cartItem
//     });

//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };



// const getAllProductsAvailableInCart = async (req, res) => {
//   try {
//     const { cartId } = req.params;

//     const items = await Cart.find({ cartId }).populate("productId");

//     return res.status(200).json({
//       success: true,
//       message: "Cart fetched successfully!",
//       data: items
//     });

//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };



// const deteleCartProduct = async (req, res) => {
//   try {
//     const {  productId } = req.params;  

//     const cartItem = await Cart.findOne({ productId });

//     if (!cartItem) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart item not found"
//       });
//     }

//     await Cart.findByIdAndDelete(cartItem._id);

//     return res.status(200).json({
//       success: true,
//       message: "Cart item deleted successfully!"
//     });

//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// module.exports = {
//   addProductIntoTheCart,
//   incrementQuantity,
//   decrementQuantity,
//   getAllProductsAvailableInCart,
//   deteleCartProduct
// };




const Cart = require("../models/cart.js");
const mongoose = require("mongoose");


const mergeCarts = async (guestCartId, targetCartId, userId = null) => {
  if (!guestCartId || guestCartId === targetCartId) return;

  const guestItems = await Cart.find({ cartId: guestCartId });

  for (const gItem of guestItems) {
    const existing = await Cart.findOne({
      cartId: targetCartId,
      productId: gItem.productId
    });

    if (existing) {
      existing.quantity += gItem.quantity;
      if (userId) existing.userId = userId;
      await existing.save();

      await Cart.findByIdAndDelete(gItem._id);
    } else {
    
      gItem.cartId = targetCartId;
      if (userId) gItem.userId = userId;
      await gItem.save();
    }
  }

};


const addProductIntoTheCart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    const quantity = Number(req.body.quantity) || 1;
    const userId = req.body.userId || null;

    if (!cartId || !productId) {
      return res.status(400).json({ success: false, message: "cartId and productId are required" });
    }


    const existingItem = await Cart.findOne({ cartId, productId });

    if (existingItem) {
      existingItem.quantity += quantity;
      if (userId) existingItem.userId = userId;
      await existingItem.save();
      return res.status(200).json({ success: true, message: 'Product quantity increased successfully!', data: existingItem });
    } else {
      const created = await Cart.create({
        cartId,
        productId,
        quantity,
        userId
      });
      return res.status(200).json({ success: true, message: "Product added into the cart successfully!", data: created });
    }

  } catch (error) {

    return res.status(400).json({ success: false, message: error.message });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    if (!cartId || !productId) return res.status(400).json({ success: false, message: "cartId and productId required" });

    const cartItem = await Cart.findOne({ cartId, productId });
    if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });

    cartItem.quantity += 1;
    await cartItem.save();

    return res.status(200).json({ success: true, message: "Quantity increased successfully", data: cartItem });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


const decrementQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    if (!cartId || !productId) return res.status(400).json({ success: false, message: "cartId and productId required" });

    const cartItem = await Cart.findOne({ cartId, productId });
    if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });

    if (cartItem.quantity <= 1) {
      await Cart.findByIdAndDelete(cartItem._id);
      return res.status(200).json({ success: true, message: "Product removed from cart" });
    }

    cartItem.quantity -= 1;
    await cartItem.save();
    return res.status(200).json({ success: true, message: "Quantity decreased successfully", data: cartItem });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


const getAllProductsAvailableInCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { userId } = req.query;

    let items;
    if (cartId) {
      items = await Cart.find({ cartId }).populate("productId");
    } else if (userId) {
      items = await Cart.find({ userId }).populate("productId");
    } else {
      return res.status(400).json({ success: false, message: "cartId param or userId query is required" });
    }

    return res.status(200).json({ success: true, message: "Cart fetched successfully!", data: items });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


const deleteCartProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    if (!cartId || !productId) return res.status(400).json({ success: false, message: "cartId and productId required" });

    const cartItem = await Cart.findOne({ cartId, productId });
    if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });

    await Cart.findByIdAndDelete(cartItem._id);
    return res.status(200).json({ success: true, message: "Cart item deleted successfully!" });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProductIntoTheCart,
  incrementQuantity,
  decrementQuantity,
  getAllProductsAvailableInCart,
  deleteCartProduct,
  mergeCarts
};
