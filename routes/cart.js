const {
  addProductIntoTheCart,
  incrementQuantity,
  decrementQuantity,
  getAllProductsAvailableInCart,
  deleteCartProduct,
} = require("../controllers/cart");

const router = require("express").Router();

router.post("/addToCart", addProductIntoTheCart);
router.put("/incrementQuantity/:cartId/:productId", incrementQuantity);
router.put("/decrementQuantity/:cartId/:productId", decrementQuantity);
router.get("/getCartProducts/:cartId", getAllProductsAvailableInCart);
router.get("/getCartProducts/user", getAllProductsAvailableInCart);
router.get("/deteleCartProduct/:cartId/:productId", deleteCartProduct);
module.exports = router;
