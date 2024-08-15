// const Product = require('../models/product.model');
const Product = require('../models/pg.product.model');

function getCart(req,res){
    res.render('customer/cart/cart');
}
async function addCartItem(req,res){
    let product;
    
 product= await Product.findById(req.body.productId);
   
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
    try{
   
    }catch(error){
        next(error);
        return;
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