const router = require("express").Router();
const { register, loginUser, emailVerify, resetPassword } = require("../controllers/auth.js");

router.post("/emailVerify", emailVerify);
router.post("/register", register);
router.post("/login", loginUser);
router.put("/resetPassword", resetPassword);

module.exports = router;
