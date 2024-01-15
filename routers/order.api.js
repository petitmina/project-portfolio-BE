const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');
const authController = require('../controllers/auth.controller.js');

router.post('/', authController.authenticate, orderController.createOrder);
router.get('/me', authController.authenticate, orderController.getOrder);
router.get('/', authController.authenticate, orderController.getOrderList);
router.put('/:id', authController.authenticate, authController.checkAdminPermission, orderController.updateOrder);

module.exports = router;
