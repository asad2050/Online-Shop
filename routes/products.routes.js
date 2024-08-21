const express = require("express");
const productController = require('../controllers/products.controller');
const {check}= require('express-validator');
const router = express.Router();

router.get('/products',productController.getAllProducts);

router.get('/products/:id',[ check('id')
    .isUUID().withMessage('Invalid product ID.')],productController.getProductDetails);//needs valid uuid check

module.exports = router;
