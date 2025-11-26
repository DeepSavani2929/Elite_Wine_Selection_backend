const router = require("express").Router()
const products = require("./products.js")
const auth = require("./auth.js")

router.use("/products", products)
router.use("/auth", auth)

module.exports = router;    