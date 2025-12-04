// const User = require("../models/auth.js");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const  mongoose  = require("mongoose");
// const nodemailer = require("nodemailer")
// const resetPasswordEmailTemplate = require("../template/resetPasswordEmail.js");

// const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_PASS,
//   },
// });

// const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, guestCartId } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required!"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const finalCartId =
//       guestCartId && guestCartId !== "null"
//         ? guestCartId
//         : "cart-" + new mongoose.Types.ObjectId().toString();

//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       cartId: finalCartId
//     });

//     const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
//       expiresIn: "1d"
//     });

//     const { password: _, ...userData } = newUser._doc;

//     return res.status(200).json({
//       success: true,
//       message: "User registered successfully!",
//       token,
//       cartId: finalCartId,
//       data: userData
//     });

//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const loggedInUser = await User.findOne({ email });
//     if (!loggedInUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials!" });
//     }

//     const isMatch = await bcrypt.compare(password, loggedInUser.password);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials!" });
//     }

//     const token = jwt.sign({ id: loggedInUser._id }, JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     const { password: _, ...userData } = loggedInUser._doc;

//     return res.status(200).json({
//       success: true,
//       message: "User LoggedIn Successfully!",
//       token,
//       data: userData,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const emailVerify = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User with this email is not registered!" });
//     }

//     const resetLink = `http://localhost:5173/reset-password/${user.email}`;

//     const htmlTemplate = resetPasswordEmailTemplate(resetLink);

//     const mailOptions = {
//       from: EMAIL_USER,
//       to: user.email,
//       subject: "Reset Your Password",
//       html: htmlTemplate,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       success: true,
//       data: { id: user._id },
//       message: "Email sent successfully!",
//     });

//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { newPassword, id } = req.body;
//       const userId = new mongoose.Types.ObjectId(id);

//     const user = await User.find({_id: userId});
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not registered" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await User.updateOne(
//       { _id: user._id },
//       { $set: { password: hashedPassword } }
//     );

//     return res
//       .status(200)
//       .json({ success: true, message: "User password changed Successfully!" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   register,
//   loginUser,
//   emailVerify,
//   resetPassword
// };

const User = require("../models/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const resetPasswordEmailTemplate = require("../template/resetPasswordEmail.js");
const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

const { mergeCarts } = require("./cart.js");
const Cart = require("../models/cart.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, guestCartId } = req.body;
//     console.log(req.body);

//     if (!firstName || !lastName || !email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required!" });
//     }

//     const existing = await User.findOne({ email });
//     if (existing)
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already registered" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // const finalCartId =
//     //   guestCartId && guestCartId !== "null"
//     //     ? guestCartId
//     //     : "cart-" + new mongoose.Types.ObjectId().toString();

//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       cartId: finalCartId,
//     });

//     // if (guestCartId && guestCartId !== "null") {
//     //   await Cart.updateMany({ cartId: guestCartId }, { userId: newUser._id });
//     // }

//     const token = await jwt.sign({ id: newUser._id }, JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     const { password: _, ...userData } = newUser._doc;

//     return res.status(200).json({
//       success: true,
//       message: "User registered successfully!",
//       token,
//       cartId: finalCartId,
//       data: userData,
//     });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };



const generateUserCartId = (userId) => {
  return `user-${userId.toString()}`;
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, guestCartId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashed
    });

    const userCartId = generateUserCartId(newUser._id);

    await mergeCarts(guestCartId, userCartId, newUser._id);

    const token = jwt.sign(
      { id: newUser._id, cartId: userCartId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Registered!",
      token,
      userId: newUser._id,
      cartId: userCartId,
      data: newUser
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// const loginUser = async (req, res) => {
//   try {
//     const { email, password, guestCartId } = req.body;

//     const loggedInUser = await User.findOne({ email });
//     if (!loggedInUser)
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials!" });

//     const isMatch = await bcrypt.compare(password, loggedInUser.password);
//     if (!isMatch)
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials!" });

//     if (
//       guestCartId &&
//       guestCartId !== "null" &&
//       guestCartId !== loggedInUser.cartId
//     ) {
//       const targetCartId =
//         loggedInUser.cartId ||
//         "cart-" + new mongoose.Types.ObjectId().toString();

//       if (!loggedInUser.cartId) {
//         loggedInUser.cartId = targetCartId;
//         await loggedInUser.save();
//       }

//       await mergeCarts(guestCartId, targetCartId, loggedInUser._id);
//     }

//     const token = jwt.sign({ id: loggedInUser._id }, JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     const { password: _, ...userData } = loggedInUser._doc;

//     return res.status(200).json({
//       success: true,
//       message: "User LoggedIn Successfully!",
//       token,
//       data: userData,
//       cartId: loggedInUser.cartId,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


const loginUser = async (req, res) => {
  try {
    const { email, password, guestCartId } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid login" });

    const userCartId = generateUserCartId(user._id);

    await mergeCarts(guestCartId, userCartId, user._id);

    const token = jwt.sign(
      { id: user._id, cartId: userCartId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Logged In!",
      token,
      userId: user._id,
      cartId: userCartId,
      data: user
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({
          success: false,
          message: "User with this email is not registered!",
        });

    const resetLink = `http://localhost:5173/reset-password/${email}`; // use user._id rather than email for safety
    const htmlTemplate = resetPasswordEmailTemplate(resetLink);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlTemplate,
    });

    return res
      .status(200)
      .json({
        success: true,
        data: { id: user._id },
        message: "Email sent successfully!",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;
    if (!email || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "email and newPassword required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not registered" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User password changed Successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  loginUser,
  emailVerify,
  resetPassword,
};
