const router = require("express").Router();
const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  // getAllProductsAvailableInCart,
  deleteCartProduct,
  getCartItems,
} = require("../controllers/cart");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/addToCart", authMiddleware, addToCart);
router.put(
  "/incrementQuantity/:cartId/:productId",
  authMiddleware,
  incrementQuantity
);
router.put(
  "/decrementQuantity/:cartId/:productId",
  authMiddleware,
  decrementQuantity
);
router.get("/getCartProducts/:cartId", authMiddleware, getCartItems);
// router.get("/getCartProducts/user", getAllProductsAvailableInCart);
router.get(
  "/deteleCartProduct/:cartId/:productId",
  authMiddleware,
  deleteCartProduct
);
module.exports = router;
