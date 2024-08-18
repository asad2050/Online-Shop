const express = require("express");
const ordersController = require("../controllers/orders.controller");
const {csrfVerify}= require('../middlewares/token')
const router = express.Router();
router.post('/',csrfVerify ,ordersController.addOrder) // /orders //needs sanitization
router.get('/',ordersController.getOrders);
router.get('/success',ordersController.getSuccess);
router.get('/failure',ordersController.getFailure);
module.exports = router;
