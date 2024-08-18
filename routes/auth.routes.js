const express = require("express");
const authController = require("../controllers/auth.controller");
const {csrfVerify} = require("../middlewares/token");
const router = express.Router();

router.get("/signup", authController.getSignup);
router.post("/signup",csrfVerify,authController.signup);//needs sanitization
router.get("/login", authController.getLogin);
router.post('/login',csrfVerify,authController.login);//needs sanitization
router.post('/logout',csrfVerify,authController.logout);
module.exports = router;
