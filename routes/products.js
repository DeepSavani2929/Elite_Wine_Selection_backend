const router = require("express").Router();
const { createProduct, getProductsBasedOnType, getFilteredProducts, getProduct } = require("../controllers/products");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/createProduct",
  upload.fields([
    { name: "productImg",  maxCount: 1  },
    { name: "varietylogo",  maxCount: 1  },
    { name: "medal",  maxCount: 1  },
  ]),
  createProduct
);
router.get("/getProductsBasedOnType", getProductsBasedOnType);
router.get("/getFilteredProducts", getFilteredProducts);
router.get("/getProduct/:id", getProduct);

module.exports = router;
