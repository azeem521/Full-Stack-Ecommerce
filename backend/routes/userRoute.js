const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword } = require('../controllers/userController');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logout);
router.put('/password/reset/:token',resetPassword)
router.post('/password/forgot',forgotPassword)

module.exports = router;