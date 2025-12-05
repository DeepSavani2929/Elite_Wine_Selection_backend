const Cart = require("../models/cart.js");
const mongoose = require("mongoose");

const mergeCarts = async (guestCartId, userCartId, userId) => {
  if (!guestCartId || guestCartId === userCartId) return;

  const guestCart = await Cart.findOne({ cartId: guestCartId });
  if (!guestCart) return;

  let userCart = await Cart.findOne({ cartId: userCartId });

  if (!userCart) {
    const newCartData = { cartId: userCartId, items: [] };
    if (userId) newCartData.userId = userId;
    userCart = await Cart.create(newCartData);
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.productId.toString() === guestItem.productId.toString()
    );

    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.items.push({
        productId: guestItem.productId,
        quantity: guestItem.quantity,
      });
    }
  }

  if (userId) userCart.userId = userId;

  await userCart.save();
  await Cart.deleteOne({ cartId: guestCartId });
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userCartId = req.user?.cartId || null;
    const userId = req.user?.id || null;
    const cartId = userCartId || req.body.cartId;

    if (!productId || !cartId)
      return res
        .status(400)
        .json({ success: false, message: "cartId and productId required" });

    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      const newCartData = { cartId, items: [] };
      if (userId) newCartData.userId = userId;

      cart = await Cart.create(newCartData);
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) {
      item.quantity++;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    if (userId) cart.userId = userId;

    await cart.save();

    return res.json({ success: true, message: "Added to cart", data: cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartId = req.user?.cartId || req.params.cartId;

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cartId is required",
      });
    }

    const items = await Cart.aggregate([
      { $match: { cartId } },

      { $unwind: "$items" },

      {
        $addFields: {
          "items.productId": {
            $cond: [
              { $eq: [{ $type: "$items.productId" }, "string"] },
              { $toObjectId: "$items.productId" },
              "$items.productId",
            ],
          },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },

      {
        $addFields: {
          productId: "$items.productId",
          quantity: "$items.quantity",
          productName: "$productDetails.productName",
          productImg: "$productDetails.productImg",
          price: "$productDetails.price",
          variety: "$productDetails.variety",
          medal: "$productDetails.medal",
          flavour: "$productDetails.flavour",
          size: "$productDetails.size",
          inStock: "$productDetails.inStock",
          categoryType: "$productDetails.categoryType",
        },
      },

      {
        $project: {
          _id: 0,
          items: 0,
          productDetails: 0,
        },
      },
    ]);

    return res.json({
      success: true,
      data: items || [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const incrementQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartId = req.user?.cartId || req.params.cartId;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.json({ success: false, message: "Item not found" });

    item.quantity++;
    await cart.save();

    return res.json({ success: true, message: "Quantity increased" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const decrementQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartId = req.user?.cartId || req.params.cartId;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );
    if (index === -1)
      return res.json({ success: false, message: "Item not found" });

    if (cart.items[index].quantity <= 1) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity--;
    }

    await cart.save();

    return res.json({ success: true, message: "Quantity updated" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

const deleteCartProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartId = req.user?.cartId || req.params.cartId;

    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    await cart.save();

    return res.json({ success: true, message: "Product removed" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  incrementQuantity,
  decrementQuantity,
  deleteCartProduct,
  mergeCarts,
};
