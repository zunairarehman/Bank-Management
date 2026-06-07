const express = require('express');
const authController = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/user/signup', authController.userSignup);
router.post('/user/verify-otp', authController.verifyOtp);
router.post('/user/login', authController.userLogin);
router.post('/user/forgot-password', authController.forgotPassword);
router.post('/user/reset-password', authController.resetPassword);
router.post('/admin/login', authController.adminLogin);
router.post('/logout', protectUser, authController.logout);
router.post('/admin/logout', protectAdmin, authController.logout);

module.exports = router;
