const Product = require("../models/products.js");

const createProduct = async (req, res) => {
  try {
 
    const {
      type,
      productName,
      variety,
      price,
      flavour,
      size,
      inStock,
      categoryType,
    } = req.body;

    const productImg = req.files?.productImg
      ? req.files.productImg[0].filename
      : null;

    const varietylogo = req.files?.varietylogo
      ? req.files.varietylogo[0].filename
      : null;

    const medal = req.files?.medal ? req.files.medal[0].filename : null;

    if (
      !productName ||
      !variety ||
      !price ||
      !flavour ||
      !size ||
      !categoryType
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!productImg) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const newProduct = await Product.create({
      type: type || null,
      productImg,
      productName,
      variety,
      varietylogo,
      price,
      medal,
      flavour,
      size,
      inStock: inStock === "false" ? false : true,
      categoryType,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProductsBasedOnType = async (req, res) => {
  try {
    const { type } = req.query;

    const products = await Product.aggregate([
        {
            $match: { type: type }
        }
    ]);

    if(!products){
      return res.status(400).json({ success: false, message: "Products are not fetched successfully!"})
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    let {
      size,
      grape,
      minPrice,
      maxPrice,
      availability,
      categoryType,
      sortBy,
      page,
      limit,
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 6;


    const matchStage = {};

    if (size && size !== "Size") {
      matchStage.size = size;
    }

    if (grape) {
      const grapeArray = grape.split(",");
      matchStage.flavour = { $in: grapeArray };
    }

    if (availability) {
      if (availability === "In Stock") matchStage.inStock = true;
      if (availability === "Out Of Stock") matchStage.inStock = false;
    }

    if (categoryType && categoryType !== "All") {
      matchStage.categoryType = categoryType;
    }

    if (minPrice && maxPrice) {
      matchStage.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

 
    const sortStage = {};
    switch (sortBy) {
      case "Alphabetically A-Z":
        sortStage.productName = 1;
        break;
      case "Alphabetically Z-A":
        sortStage.productName = -1;
        break;
      case "Price, low to high":
        sortStage.price = 1;
        break;
      case "Price, high to low":
        sortStage.price = -1;
        break;
      case "Date, new to old":
        sortStage.createdAt = -1;
        break;
      case "Date, old to new":
        sortStage.createdAt = 1;
        break;
      case "Featured":
        sortStage.categoryType = 1;
        break;
      default:
        sortStage.createdAt = -1;
    }

    const pipeline = [
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const products = await Product.aggregate(pipeline);

    const totalCount = await Product.countDocuments(matchStage);

    return res.status(200).json({
      success: true,
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getRelatedProducts = async (req, res) => {
  try {

    const relatedProducts = await Product.aggregate([
      { $sample: { size: 3 } }
    ]);

    return res.status(200).json({
      success: true,
      message: "Related products fetched successfully",
      data: relatedProducts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createProduct,
  getProductsBasedOnType,
  getFilteredProducts,
  getProduct,
  getRelatedProducts
};
