const router = require("express").Router();
const { register, loginUser } = require("../controllers/auth.js");

router.post("/register", register);
router.post("/login", loginUser);

module.exports = router;
