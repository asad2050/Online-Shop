const Cart = require('../models/cart.model');
function intializeCart(req,res,next){
let cart;
if(!req.session.cart){
    cart= new Cart();//session works such that any data stored in session might not have the methods in it.
}else{

    const sessionCart  = req.session.cart;
    
    cart =new Cart(sessionCart.items,sessionCart.totalQuantity,sessionCart.totalPrice);
}
    res.locals.cart = cart;
    next();
}

module.exports= intializeCart;