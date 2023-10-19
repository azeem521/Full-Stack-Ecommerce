const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// create product for admin only

exports.createProduct = catchAsyncError(async (req, res, next) => {
     req.body.user = req.user.id
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});
// get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 2;
    const productCount =await Product.countDocuments();

  //    const apifeature = new ApiFeatures(Product.find(),req.query).search().filter();
  const apifeature = new ApiFeatures(Product, req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // const products = await Product.find()
  const products = await apifeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

// get product detail

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(401).json({success:false,message:'product not fount'});
    return next(new ErrorHandler("product not fount", 404));
  }
  return res.status(200).json({ success: true, product });
});

//  update product for admin only

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    //    return res.status(401).json({message:'Product not found'})
    return next(new ErrorHandler("product not fount", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useValidators: true,
    useFindAndModify: false,
  });
  return res.status(401).json({ message: "Updated successfully", product });
});

// Delete product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    //    return res.status(401).json({success:false,message:'product not found'});
    return next(new ErrorHandler("product not fount", 404));
  }
  await Product.deleteOne({ _id: req.params.id });
  return res
    .status(200)
    .json({ success: true, message: "Deleted successfully!" });
});
