const { addProductIntoTheCart, incrementQuantity, decrementQuantity, getAllProductsAvailableInCart, deteleCartProduct } = require("../controllers/cart")

const router = require("express").Router()

router.post("/addToCart", addProductIntoTheCart)
router.put("/incrementQuantity/:productId", incrementQuantity)
router.put("/decrementQuantity/:productId", decrementQuantity)
router.get("/getCartProducts/:cartId", getAllProductsAvailableInCart)
router.get("/deteleCartProduct/:productId", deteleCartProduct)
module.exports = router;