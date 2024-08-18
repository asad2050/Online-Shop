const express = require("express");
const cartController = require("../controllers/cart.controller");
const {csrfVerify} = require("../middlewares/token.js");
const router = express.Router();
router.get('/', cartController.getCart);// /cart/
router.post('/items',csrfVerify,cartController.addCartItem);//needs sanitization
router.patch("/items",csrfVerify,cartController.updateCartItem);//needs sanitization
module.exports = router;
