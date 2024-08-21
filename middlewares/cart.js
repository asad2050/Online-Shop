const Cart = require('../models/cart.model');
function initializeCart(req,res,next){
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



// function initializeCart(req, res, next) {
//   let cart;  console.log(new Date().toLocaleString());


//   // Validate session cart if it exists
//   if(!req.session.cart){
//     cart= new Cart();//session works such that any data stored in session might not have the methods in it.
// }else{
//   const { items, totalQuantity, totalPrice } = req.session.cart;

//   // Validate that cart items is an array
//   // if (!Array.isArray(items)) {
//   //   return res.status(400).json({ error: 'Cart items must be an array.' });
//   // }

//   // // Validate each cart item
//   // for (const item of items) {
//   //   if (!item.hasOwnProperty('product') || !item.hasOwnProperty('quantity') || !item.hasOwnProperty('totalPrice')) {
//   //     return res.status(400).json({ error: 'Each cart item must have a product, quantity, and totalPrice.' });
//   //   }

//   //   // Additional checks for item properties can be added here if needed
//   // }

//   // // Validate totalQuantity
//   // if (!Number.isInteger(totalQuantity) || totalQuantity < 0) {
//   //   return res.status(400).json({ error: 'Total quantity must be a non-negative integer.' });
//   // }

//   // // Validate totalPrice
//   // if (typeof totalPrice !== 'number' || totalPrice < 0) {
//   //   return res.status(400).json({ error: 'Total price must be a non-negative number.' });
//   // }
//     const sessionCart  = req.session.cart;
    
//     cart =new Cart(sessionCart.items,sessionCart.totalQuantity,sessionCart.totalPrice);
// }
//     res.locals.cart = cart;
//     next();
//     console.log(new Date().toLocaleString());
//   }






module.exports= initializeCart;
