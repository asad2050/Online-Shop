const express = require("express");
const cartController = require("../controllers/cart.controller");
const cartValidation = require('../util/cart.validation')
const {csrfVerify} = require("../middlewares/token.js");
const router = express.Router();
router.get('/', cartController.getCart);// /cart/
router.post('/items',csrfVerify,cartValidation.validateCartItem,cartController.addCartItem);//needs sanitization
router.patch("/items",csrfVerify,cartValidation.validateCartItem,cartController.updateCartItem);//needs sanitization
module.exports = router;
