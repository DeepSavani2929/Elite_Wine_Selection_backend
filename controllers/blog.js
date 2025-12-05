const Blog = require("../models/blog.js");

// ------------------------
// Create a Blog
// ------------------------
const createBlog = async (req, res) => {
  try {
    const { blogTitle, blogDesc, blogContent } = req.body;
    const blogImg = req.file?.filename || null;

    if (!blogImg) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    if (!blogTitle || !blogDesc || !blogContent) {
      return res.status(400).json({
        success: false,
        message: "Required blog fields are missing!",
      });
    }

    await Blog.create({ blogImg, blogTitle, blogDesc, blogContent });

    return res
      .status(201)
      .json({ success: true, message: "Blog is created successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ------------------------
// Get Latest Blogs (Limit 3)
// ------------------------
const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);

    return res.status(200).json({
      success: true,
      data: allBlogs,
      message: "Blogs are fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ------------------------
// Get Single Blog by ID
// ------------------------
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found!" });
    }

    return res.status(200).json({
      success: true,
      data: blog,
      message: "Blog is fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ------------------------
// Get Other Blogs Except Current ID
// ------------------------
const getOtherBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const otherBlogs = await Blog.find({ _id: { $ne: id } });

    return res.status(200).json({
      success: true,
      data: otherBlogs,
      message: "Other blogs fetched successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  getOtherBlogs,
};
