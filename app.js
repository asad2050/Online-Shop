const express = require('express');
const expressSession= require('express-session');
const createSessionConfig = require('./config/pgSession');
const {pool} = require('./data/pgDatabase');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
const helmet = require('helmet');
const {csrfMiddleware} =require('./middlewares/token.js');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const path = require('path');
const checkAuthStatus = require('./middlewares/check-auth');
const protectRoutesMiddleware= require('./middlewares/protect-routes');
const cartMiddlware = require('./middlewares/cart');
const updateCartPriceMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
const authRoutes = require('./routes/auth.routes');
const productsRoutes= require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes= require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app= express();
require("dotenv").config();
app.use(limiter);
app.set('view engine','ejs');
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trustedscripts.com"],
    styleSrc: ["'self'",  "https://fonts.googleapis.com"],
    imgSrc: ["'self'","https://res.cloudinary.com"],
    connectSrc: ["'self'", ],
    fontSrc: ["'self'",,"https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));
app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));
app.use('/products/assets',express.static('product-data'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());//json()returns a function which is a middleware
const sessionConfig=createSessionConfig();
app.use(expressSession(sessionConfig))
app.use(cartMiddlware);
app.use(updateCartPriceMiddleware);
app.use(csrfMiddleware);
app.use(checkAuthStatus);
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart',cartRoutes);
app.use('/orders',protectRoutesMiddleware,ordersRoutes);
app.use('/admin',protectRoutesMiddleware,adminRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
let PORT = 3000;
if(process.env.PORT){
  PORT = process.env.PORT;
}

pool.query("SELECT NOW()").then(function() {
    app.listen(PORT);
}).catch(function(error){
    console.log("Failed to connect to the database.");
    console.log(error);
})

