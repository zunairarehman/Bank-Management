const express = require('express');
const userController = require('../controllers/userController');
const transferController = require('../controllers/transferController');
const { protectUser } = require('../middleware/auth');

const router = express.Router();
router.use(protectUser);

router.get('/dashboard', userController.getDashboard);
router.get('/transactions', userController.getTransactions);
router.get('/cards', userController.getCards);
router.patch('/cards/:id', userController.updateCardStatus);
router.post('/bills/pay', userController.payBill);
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

router.post('/transfer', transferController.transferMoney);
router.get('/beneficiaries', transferController.getBeneficiaries);
router.post('/beneficiaries', transferController.addBeneficiary);
router.delete('/beneficiaries/:id', transferController.deleteBeneficiary);

module.exports = router;
