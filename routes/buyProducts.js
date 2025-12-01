const router = require("express").Router();
const buyProducts = require("../controllers/buyProducts");

router.post("/createPaymentIntent", buyProducts);
module.exports = router;
