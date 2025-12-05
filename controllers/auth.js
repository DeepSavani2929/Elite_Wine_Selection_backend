const User = require("../models/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;
const { mergeCarts } = require("./cart.js");
const nodemailer = require("nodemailer");

// ----------------------
// Email Transporter
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// ----------------------
// Utilities
// ----------------------
const generateUserCartId = (userId) => `user-${userId.toString()}`;

const createJwtToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

// ----------------------
// Register Controller
// ----------------------
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, guestCartId } = req.body;

    if (await User.findOne({ email })) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const userCartId = generateUserCartId(newUser._id);
    await mergeCarts(guestCartId, userCartId, newUser._id);

    const token = createJwtToken({ id: newUser._id, cartId: userCartId });

    return res.json({
      success: true,
      message: "User registered successfully!",
      token,
      userId: newUser._id,
      cartId: userCartId,
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, guestCartId } = req.body;

    // Validate user existence
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });

    // Password match
    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }

    // Assign cart and merge
    const userCartId = generateUserCartId(user._id);
    await mergeCarts(guestCartId, userCartId, user._id);

    // Create token
    const token = createJwtToken({ id: user._id, cartId: userCartId });

    return res.status(200).json({
      success: true,
      message: "User loggedIn successfully!",
      token,
      userId: user._id,
      cartId: userCartId,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------------
// Email Verification
// ----------------------
const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User with this email is not registered!",
      });

    const resetLink = `http://localhost:5173/reset-password/${email}`;
    const htmlTemplate = resetPasswordEmailTemplate(resetLink);

    await transporter.sendMail({
      from: EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlTemplate,
    });

    return res.status(200).json({
      success: true,
      data: { id: user._id },
      message: "Email sent successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------------
// Reset Password
// ----------------------
const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({
        success: false,
        message: "email and newPassword required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not registered" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User password changed Successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  loginUser,
  emailVerify,
  resetPassword,
};
