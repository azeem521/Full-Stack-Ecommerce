const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const {
  getAllUsers,
  getSingleUserDetail,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// router.route('/products').get(getAllProducts)
router.get("/products", getAllProducts);
router.post(
  "/products/admin/new",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  createProduct
);
router.put(
  "/products/admin/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateProduct
);
router.delete(
  "/products/admin/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteProduct
);
router.get("/products/:id", getProductDetails);

router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getAllUsers
);
router.get(
  "/admin/user_detail/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  getSingleUserDetail
);
router.post(
  "/admin/update_role/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  updateUserRole
);
router.delete(
  "/admin/delete_user/:id",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  deleteUser
);

router.put("/review", isAuthenticatedUser, createProductReview);

router.get(
  "/review",
  isAuthenticatedUser,
  authorizedRoles("admin"), getProductReviews
);

module.exports = router;
