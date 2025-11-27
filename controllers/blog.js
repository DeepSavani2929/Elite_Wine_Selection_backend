const Blog = require("../models/blog.js");

const createBlog = async (req, res) => {
  try {
    console.log("fvdvd")
    const { blogTitle, blogDesc, blogContent } = req.body;

    const blogImg = req.file ? req.file.filename : null;

    if (!blogImg) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    if (!blogTitle || !blogDesc || !blogContent) {
      return res
        .status(400)
        .json({ success: false, message: "required blog fields are missing!" });
    }

    await Blog.create({
      blogImg,
      blogTitle,
      blogDesc,
      blogContent,
    });

    return res
      .status(201)
      .json({ success: true, message: "Blog is created successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find();

    if (!allBlogs) {
      return res
        .status(400)
        .json({ success: false, message: "Blogs are not found!" });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: allBlogs,
        message: "Blogs are fetched successfully!",
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if(!blog) {
        return res.status(400).json({ success: false, message: "blog is not found!"})
    }

    return res.status(200).json({ success: true, data: blog, message: "Blog is fetched successfully!"})
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
};
