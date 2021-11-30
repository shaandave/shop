const { check, validationResult} = require('express-validator');
 
exports.signupValidation = [
    check('name', 'Name is requied').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]
 
exports.loginValidation = [
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Email or password Worng').isLength({ min: 6 })
 
]

exports.productValidation = [
    check('name', 'Name is requied').not().isEmpty(),
    check('product_code', 'Product Code is requied').not().isEmpty(),
    check('price', 'Please enter valid price').not().isEmpty().isNumeric(),
    check('category', 'Product Category is requied').not().isEmpty(),
    //check('expiry_date', 'Please enter valid Expiry Date').not().isEmpty().isDate(),
    //check('status', 'Please enter valid Status in 0 or 1').not().isIn(['0', '1'])
]