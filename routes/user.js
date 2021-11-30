const express = require('express');
const router = express.Router();
const { signupValidation, loginValidation } = require('../util/validation');
const { validationResult } = require('express-validator');
const { get_jwt_token } = require('../util/common');
const userController = require('../controllers/userController');
const bcrypt = require('bcrypt');
const saltRounds = 5;

router.post('/login', loginValidation, (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(404).json(errors)
    } else {
        var email = req.body.email.trim();
		userController.checkUser(email, function (err, result) {
			if (err) {
				res.status(500).json({
					success: false,
					error: true,
					data: Array(),
					message: "Something went wrong"
				});
			}
			if ((Array.isArray(result) && result.length == 0)) {
				res.status(409).json({
					success: false,
					error: true,
					data: Array(),
					message: 'Email Not found'
				});
			} else {
                bcrypt.compare(req.body.password, result[0]['password'], function (err, isMatch) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            error: true,
                            data: Array(),
                            message: "Something went wrong"
                        });
                    }
                    if (isMatch) {
                        get_jwt_token(result[0].id, result[0].email, function (err, token) {
                            if (err) {
                                res.send(err);
                                res.status(500).json({
                                    success: false,
                                    error: true,
                                    data: Array(),
                                    message: "Somthing Went Wrong"
                                });
                            } else {
                                res.status(200).json({
                                    success: true,
                                    error: false,
                                    data: {
                                        user_id : result[0].user_id,
                                        email: result[0].email,
                                        fname: result[0].fname,
                                        lname: result[0].lname,
                                    },
                                    token: token,
                                    message: "Login Successfully!!"
                                });
                            }
                        });
                    } else {
                        res.status(401).json({
                            success: false,
                            error: true,
                            data: Array(),
                            message: "Wrong Password"
                        });
                    }
                });
			}
		});
    }
});


router.post('/signup', signupValidation, (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(404).json(errors)
    }
    else {
        userController.checkEmailIsExist(req.body.email, function (err, result) {
			if (err) {
				res.status(500).json({
					success: false,
					error: true,
					data: Array(),
					message: "Email is already exist"
				});
			}
			if (Array.isArray(result) && result.length) {
				res.status(409).json({
					success: false,
					error: true,
					data: Array(),
					message: "Email is already exist"
				});
			} else {
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					if (err) {
						res.status(500).json({
							success: false,
							error: true,
							data: Array(),
							message:'Something went wrong'
						});
					} else {
						var Insert_array = [
							[req.body.name, req.body.email, hash]
						];
						userController.createUser(Insert_array,function (err, created_user_result) {
                            if (err) {
                                res.status(500).json({
                                    success: false,
                                    error: true,
                                    data: Array(),
                                    message:'Something went wrong'
                                });
                            } else {
                                res.status(200).json({
                                    success: true,
                                    error: false,
                                    data: created_user_result,
                                    message: 'Registration Successfully!'
                                });
                            }
                        });
					}
				});
			}
		});
    }
});

module.exports = router;