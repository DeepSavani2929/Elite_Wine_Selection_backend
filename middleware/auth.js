const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = function authCart(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null;  
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      cartId: decoded.cartId
    };
  } catch {
    req.user = null;
  }

  next();
};