const { body,validationResult} = require('express-validator');


async function orderIsValid(cart) {

    const cartCheck =[
      body('cart.items.*.product.id').isUUID().withMessage('Invalid product ID.'),
        body('cart.items.*.product.title')
          .trim()
          .escape()
          .isString().withMessage('Product title must be a string.')
          .notEmpty().withMessage('Product title is required.'),
        body('cart.items.*.product.price')
          .trim()
          .isFloat({ min: 0 }).withMessage('Product price must be a positive number.'),
        body('cart.items.*.quantity')
          .trim()
          .isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
        body('cart.totalQuantity')
          .trim()
          .isInt({ min: 1 }).withMessage('Total quantity must be at least 1.'),
        body('cart.totalPrice')
          .trim()
          .isFloat({ min: 0 }).withMessage('Total price must be a positive number.'),
      ];

  // Validate password const req = {
    const req = {
      body: { cart }
    };
  
 

  // Run the validations manually on the provided values
  for (let check of cartCheck) {
    const result = await check.run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return {
        isValid: false,      };
    }
  }
 

  // If both validations pass, return true
  return true;
}

  
  module.exports = {
    orderIsValid:orderIsValid
  }