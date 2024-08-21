const {check} = require('express-validator');
const validateCartItem = [
    check('productId')
      .isUUID().withMessage('Invalid product ID.'),
    check('quantity')
      .optional() // `quantity` is only required for updating items
      .isInt({ min: 0}).withMessage('Quantity must be at least 1.')
  ];

module.exports={
    validateCartItem
}