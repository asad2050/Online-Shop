const Product = require('../models/pg.product.model');
const Order = require('../models/pg.order.model');
const {uploadOnCloudinary} = require('../util/cloudinary');
const {validationResult}= require('express-validator');
const sessionFlash = require("../util/session-flash");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  let sessionData= sessionFlash.getSessionData(req);
  if(!sessionData){
    sessionData={
      title:'',
      price:'',
      summary:'',
      description:''
    }
  }
  res.render('admin/products/new-product',{inputData:sessionData});
}

async function createNewProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors
    sessionFlash.flashDataToSession(req,{
      errorMessage:"Please check your input",
      title: req.body.title,
      price:req.body.price,
      summary:req.body.summary,
      description:req.body.description,
    },function(){
      res.redirect("/admin/products/new")
    })
    return
  }

  let productImage;
  try{
    const imageLocalPath = req.file.path;
    if(!imageLocalPath){
      throw new Error("Image file is required")
    }
     productImage = await uploadOnCloudinary(imageLocalPath)
    if(!productImage && !productImage?.url){
      throw new Error("Image upload failed")
    }
    
  }catch(err){
    next(err);
    return;
  }
  const product = new Product({
    ...req.body,
    image: productImage.url,
  });


  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  let sessionData= sessionFlash.getSessionData(req);
  if(!sessionData){
    sessionData={
      errorMessage:""
    }
  }
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product ,inputData:sessionData});
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors
    sessionFlash.flashDataToSession(req,{
      errorMessage:"Please check your input",
      title: req.body.title,
      price:req.body.price,
      summary:req.body.summary
    },function(){
      res.redirect("/admin/products/"+req.params.id)
    })
    return
  }
  const imageLocalPath = req.file?.path;
  let product;
  let productImage;
  if(imageLocalPath){
    try{
   
      console.log(imageLocalPath)
       productImage = await uploadOnCloudinary(imageLocalPath)
      product = new Product({
        ...req.body,
        
        id: req.params.id,
      });
      if(!productImage && !productImage?.url){
        throw new Error("Image upload failed")
      }
     
      
    }catch(err){
      next(err);
      return;
    }

  }
  else{
    product = new Product({
      ...req.body,
      id: req.params.id,
    })
  }
 

  try {
  
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render the page with errors
    return res.status(400).json({
      errors:errors.array(),
      message: 'Invalid product ID. Please correct the errors and try again.',
    });
  }
  let product;
  
  try {

    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(),message:"Invalid order ID" });
  }
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
  
    const order = await Order.findById(orderId);
    
    order.status = newStatus;
    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};