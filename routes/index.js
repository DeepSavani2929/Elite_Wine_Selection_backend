const router = require("express").Router();
const auth = require("./auth.js");
const products = require("./products.js");
const blogs = require("./blog.js");
const cart = require("./cart.js");
const buyAllCartProducts = require("./buyProducts.js");

router.use("/auth", auth);
router.use("/products", products);
router.use("/blogs", blogs);
router.use("/cart", cart);
router.use("/buyProducts", buyAllCartProducts);

module.exports = router;
