const Product = require('../models/pg.product.model');
const { validationResult } = require('express-validator');
const sessionFlash = require("../util/session-flash");
function getCart(req,res){
  let sessionData= sessionFlash.getSessionData(req);
  if(!sessionData){
    sessionData={
      errorMessage:""
    }
  }
    res.render('customer/cart/cart',{  errorMessage:sessionData.errorMessage
    });
}
async function addCartItem(req,res){
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    let product;
    
 try {
    product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    return next(error);
  }
    const cart = res.locals.cart;
    cart.addItem(product);
    req.session.cart= cart;
    //we don't to call save bcs the cart data is not used after.
    res.status(201).json({
        message:'Cart Update',
        newTotalItems: cart.totalQuantity,
    })//successfully added data =201 code.
}
function updateCartItem(req,res){
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    
const cart = res.locals.cart;
const updatedItemData=cart.updateItem(req.body.productId, +req.body.quantity);
req.session.cart= cart;

res.json({
    message:'Item updated',
    updatedCartData:{
       newTotalQuantity: cart.totalQuantity,
        newTotalPrice:cart.totalPrice,
        updatedItemPrice:updatedItemData.updatedItemPrice,
    } 
});
}
module.exports={
    addCartItem:addCartItem,
    getCart:getCart,
    updateCartItem:updateCartItem,
}