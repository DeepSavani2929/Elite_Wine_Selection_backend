const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { createBlog, getBlogs, getBlog } = require("../controllers/blog");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/createBlog", upload.single("blogImg"), createBlog);
router.get("/getBlogs", getBlogs);
router.get("/getBlog/:id", getBlog);

module.exports = router;
