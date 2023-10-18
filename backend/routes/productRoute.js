const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');

const router = express.Router();

// router.route('/products').get(getAllProducts)
router.get('/products',getAllProducts);
router.post('/products/new',createProduct);
router.put('/products/:id',updateProduct);
router.delete('/products/:id',deleteProduct);
router.get('/products/:id',getProductDetails);
module.exports = router;