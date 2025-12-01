const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    blogImg: {
      type: String,
      required: true,
    },
    blogTitle: {
      type: String,
      required: true,
      trim: true,
    },
    blogDesc: {
      type: String,
      required: true,
    },
    blogContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
