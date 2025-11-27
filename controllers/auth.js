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



// controllers/authController.js
const User = require("../models/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const resetPasswordEmailTemplate = require("../template/resetPasswordEmail.js");
const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;

const { mergeCarts } = require("./cartController");
const Cart = require("../models/cart.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});


const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, guestCartId } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalCartId = guestCartId && guestCartId !== "null"
      ? guestCartId
      : "cart-" + new mongoose.Types.ObjectId().toString();

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      cartId: finalCartId
    });



    if (guestCartId && guestCartId !== "null") {
      await Cart.updateMany({ cartId: guestCartId }, { userId: newUser._id });
    }

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });
    const { password: _, ...userData } = newUser._doc;

    return res.status(200).json({
      success: true,
      message: "User registered successfully!",
      token,
      cartId: finalCartId,
      data: userData
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Login:
 * Accepts body: { email, password, guestCartId? }
 * Behavior:
 * - If guestCartId provided and different from user's cartId, merge guestCartId into user's cartId.
 * - Return token and user data.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password, guestCartId } = req.body;

    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser) return res.status(400).json({ success: false, message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, loggedInUser.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials!" });

    // If client had a guest cart, merge it into user's cart
    if (guestCartId && guestCartId !== "null" && guestCartId !== loggedInUser.cartId) {
      // ensure target cartId exists for user
      const targetCartId = loggedInUser.cartId || ("cart-" + new mongoose.Types.ObjectId().toString());

      // If user had no cartId earlier, set it;
      if (!loggedInUser.cartId) {
        loggedInUser.cartId = targetCartId;
        await loggedInUser.save();
      }

      await mergeCarts(guestCartId, targetCartId, loggedInUser._id);
      // After merge, guestCartId items moved to user's cartId
    }

    const token = jwt.sign({ id: loggedInUser._id }, JWT_SECRET, { expiresIn: "1d" });
    const { password: _, ...userData } = loggedInUser._doc;

    return res.status(200).json({
      success: true,
      message: "User LoggedIn Successfully!",
      token,
      data: userData,
      cartId: loggedInUser.cartId
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * emailVerify and resetPassword fixes: resetPassword now uses findById correctly.
 */
const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User with this email is not registered!" });

    const resetLink = `http://localhost:5173/reset-password/${user._id}`; // use user._id rather than email for safety
    const htmlTemplate = resetPasswordEmailTemplate(resetLink);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlTemplate
    });

    return res.status(200).json({ success: true, data: { id: user._id }, message: "Email sent successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, id } = req.body;
    if (!id || !newPassword) return res.status(400).json({ success: false, message: "id and newPassword required" });

    // findById returns doc or null
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not registered" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "User password changed Successfully!" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  loginUser,
  emailVerify,
  resetPassword
};
