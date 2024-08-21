const stripe = require('stripe')(process.env.STRIPE_KEY); // comment out/remove this if you do not use stripe.
const Order = require('../models/pg.order.model');
const User = require('../models/pg.user.model');
const sessionFlash = require("../util/session-flash");
const orderValidation= require('../util/order.validation')
async function getOrders(req, res,next) {
 
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    

    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {

  if (!orderValidation.orderIsValid(res.locals.cart)) {
    sessionFlash.flashDataToSession(req,{
      errorMessage:"Please check for errors and try again" ,
    },function(){
      res.redirect('/cart')
    })
    return
  }
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
    
  } catch (error) {
    return next(error);
  }
 

  // const order = new Order(cart, userDocument); Mongodb
  const order = new Order(cart, userDocument); // pgsql


  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;
  //   res.redirect(303, 'http://localhost:3000/orders/success');
  // comment out the session part  if you don't want to use stripe. And comment in the above line.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map(function(item){
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price * 100// unit_amount takes price in cents so we mulitply by 100
        },
        quantity: item.quantity,
      }
    }) ,
    mode: 'payment',
    success_url: 'http://localhost:3000/orders/success',
    cancel_url: 'http://localhost:3000/orders/failure',
  });
  
  res.redirect(303, session.url);
}
function getSuccess(req,res){
  res.render('customer/orders/success');
}
function getFailure(req,res){
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess:getSuccess,
  getFailure:getFailure
};