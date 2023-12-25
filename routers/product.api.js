const express = require('express');
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.post('/', authController.authenticate, productController.createProduct);
router.get('/', productController.getProduct);
// router.put('/:id', productController.updateProduct);

module.exports = router;
