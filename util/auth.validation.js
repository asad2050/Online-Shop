const {check} = require('express-validator');
//  Validation middleware for signup
const validateSignup = [
  check('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  check('confirmEmail')
    .custom((value, { req }) => value === req.body.email).withMessage('Emails do not match.'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  check('firstName')
    .notEmpty().withMessage('First name is required.')
    .trim().escape(),
  check('lastName')
    .notEmpty().withMessage('Last name is required.')
    .trim().escape(),
  check('street')
    .notEmpty().withMessage('Street address is required.')
    .trim().escape(),
  check('postal')
    .isLength({ min: 5, max: 5 }).withMessage('Postal code must be 5 characters long.')
    .trim().escape(),
  check('city')
    .notEmpty().withMessage('City is required.')
    .trim().escape(),
];

// Validation middleware for login
const validateLogin = [
  check('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage('Password is required.'),
    check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

];
module.exports={
    validateSignup,
    validateLogin
}