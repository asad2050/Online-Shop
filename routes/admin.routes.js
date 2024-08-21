const express = require('express');
const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');
const {csrfVerify}= require('../middlewares/token')
const{productValidation,orderValidation, deleteValidation}= require('../util/admin.validation')
const router = express.Router();

router.get('/products', adminController.getProducts); // /admin/products

router.get('/products/new',adminController.getNewProduct);//needs sanitization

router.post('/products',imageUploadMiddleware,csrfVerify,  productValidation,adminController.createNewProduct); //needs sanitization

router.get('/products/:id', adminController.getUpdateProduct);//needs valid uuid check

router.post('/products/:id', imageUploadMiddleware,csrfVerify, productValidation,adminController.updateProduct);//needs sanitization //needs valid uuid check

router.delete('/products/:id',csrfVerify,deleteValidation,adminController.deleteProduct);//needs valid uuid check

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id',csrfVerify, orderValidation,adminController.updateOrder);//needs sanitization //needs valid uuid check

module.exports = router;