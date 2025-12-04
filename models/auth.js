// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },

//   lastName: {
//     type: String,
//     required: true,
//   },

//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   cartId: {
//     type: String,
//     unique: true,
//   },
// });

// const user = mongoose.model("auth", userSchema);
// module.exports = user;



// models/auth.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },

//     cartId: { type: String, unique: true, required: true },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("auth", userSchema);
// module.exports = User;



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", userSchema);