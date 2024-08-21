const {check}= require('express-validator')
const productValidation = [
    check('title')
      .notEmpty().withMessage('Title is required.')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long.'),
    check('price')
      .isFloat({ min: 0.01 }).withMessage('Price must be a positive number.'),
    check('summary')
      .notEmpty().withMessage('Summary is required.')
      .isLength({ min: 5 }).withMessage('Summary must be at least 5 characters long.')
  ];
  const orderValidation = [
    check('productId')
      .isUUID().withMessage('Invalid product ID.'),
    check('newStatus')
      .notEmpty().withMessage('Order status is required.')
      .isIn(['pending', 'shipped', 'delivered', 'canceled']).withMessage('Invalid order status.')
  ];
  const deleteValidation = [
    check('id')
      .notEmpty().withMessage('Product ID is required.')
      .isUUID().withMessage('Invalid product ID.')
  ];

module.exports={
    productValidation,
    orderValidation,
    deleteValidation
}