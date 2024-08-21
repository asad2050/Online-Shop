const Product = require('../models/pg.product.model');
const {validationResult}= require("express-validator");
async function getAllProducts(req,res,next){
    try{
const products= await Product.findAll();
        
        
    res.render('customer/products/all-products',{products:products});
    } catch(error){
        next(error);
    }
}

async function getProductDetails(req,res,next){
    
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new Error(errors.array()[0].msg);
        }
    const product= await Product.findById(req.params.id);
    res.render('customer/products/product-details',{product:product});
    } catch(error){
        next(error);
    }
    
}
module.exports={
    getAllProducts:getAllProducts,
    getProductDetails:getProductDetails,
}