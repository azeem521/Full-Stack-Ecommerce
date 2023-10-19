const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

// router.route('/products').get(getAllProducts)
router.get('/products', getAllProducts);
router.post('/products/new',isAuthenticatedUser,authorizedRoles(('admin')),createProduct);
router.put('/products/:id',isAuthenticatedUser,authorizedRoles(('admin')),updateProduct);
router.delete('/products/:id',isAuthenticatedUser,authorizedRoles(('admin')),deleteProduct);
router.get('/products/:id',getProductDetails);
module.exports = router;