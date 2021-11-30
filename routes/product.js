const express = require('express');
const router = express.Router();
const { productValidation } = require('../util/validation');
const { validationResult } = require('express-validator');
const productController = require('../controllers/productController');

router.post("/create", productValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(404).json(errors)
    }  else {
        const datetime = new Date();
        var Insert_array = [
            [req.body.name, req.body.image, req.body.product_code, req.body.price, req.body.category, datetime.toISOString().slice(0,10), req.body.expire_date, req.trusted.user_id, req.body.status]
        ];
        productController.createProduct(Insert_array,function (err, created_result) {
            if (err) {
                res.send(err);
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
                    data: created_result,
                    message: 'Product Cteated Successfully!'
                });
            }
        });
    }
});

router.post("/update", (req,res, next) => {
    if ((req.body.id != "") && ((req.body.name == "") || (req.body.description == "") || (req.body.category_id == "") || (req.body.price == ""))) {
        res.status(404).json({
            success: false,
            error: true,
            data: Array(),
            message: "Data is invalid."
        });
    } else { 
        productController.checkProductIsExistByID(req.body.id, req.trusted.user_id, (err, result) => {
            if (Array.isArray(result) && result.length == 0) {
                res.status(409).json({
                    success: false,
                    error: true,
                    data: Array(),
                    message: "You do not have access to modify this product"
                });
            } else {
                let priceFlag = true;
                if(req.body.price) {
                    productController.checkPriceUpdationCorrect(req.body.price, req.body.id,  (err, result) => {
                        if(!result) {
                            priceFlag = false;
                            res.status(409).json({
                                success: false,
                                error: true,
                                data: [],
                                message: "You can only change price in ratio of +10% and -10%"
                            });
                        } else {
                            var Insert_array = [req.body.name, req.body.image, req.body.product_code, req.body.price, req.body.category, req.body.expiry_date, req.body.status];
                            productController.updateProduct(Insert_array,req.body.id, function (err, updated_result) {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        error: true,
                                        data: err,
                                        message: "Something went wrong"
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        error: false,
                                        data: updated_result,
                                        message: "Post Updated Successfully"
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
});

router.delete("/delete", (req, res, next) => {
    if ((!req.body.id)) {
        res.status(404).json({
            success: false,
            error: true,
            data: Array(),
            message: "Please pass id which you want to delete"
        });
    } else { 
        productController.checkProductIsExistByID(req.body.id, req.trusted.user_id, (err, result) => {
            if (Array.isArray(result) && result.length == 0) {
                res.status(409).json({
                    success: false,
                    error: true,
                    data: Array(),
                    message: "You do not have access to delete this product"
                });
            } else {
                productController.deleteproduct(req.body.id, function (err, update_result) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            error: true,
                            data: err,
                            message: "Something Went Wrong"
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            error: false,
                            data: update_result,
                            message: 'product deleted successfully'
                        });
                    }
                });
            }
        });
    }
});

router.get('/', (req, res, next) => {
    productController.getAllProducts(function (err, category_result) {
        if (err) {
            res.status(500).json({
                success: false,
                error: true,
                data: err,
                message: "Something Went Wrong"
            });
        } else {
            res.status(200).json({
                success: true,
                error: false,
                data: category_result,
            });
        }
    });
});

router.post('/pagination', (req, res, next) => {
    var limit = parseInt(req.body.perpage);
    var offset = parseInt(req.body.pageno);
    var searchby = req.body.search;
    
    if (!limit) limit = 10;
    if (!offset) offset = 0;

    var LIMIT = ' LIMIT  ? OFFSET ? ';
    var search_conditions = ' AND ((name LIKE "%' + searchby + '%") OR (category LIKE "%' + searchby + '%") OR (product_code LIKE "%' + searchby + '%"))';

    var SQL = 'SELECT * FROM `product` Where 1';

    if (searchby) {
        var SQL_SEARCH = SQL + search_conditions 

        var FINAL_SQL = SQL + search_conditions  + LIMIT;
        SQL = SQL_SEARCH;
    } else {
        var FINAL_SQL = SQL  + LIMIT;
        SQL = SQL
    }
//res.send(FINAL_SQL);
    db.query(FINAL_SQL, [limit, offset], function (err, final_result) {
        if (err) {
            res.status(500).json({
                error: true,
                success: false,
                data: err,
                message: "Something went wrong"
            });
        } else {
            if (Array.isArray(final_result) && final_result.length == 0) {
                res.status(200).json({
                    error: false,
                    success: true,
                    'page': Array(),
                    'total_pages': 0,
                    'total_records': 0
                });
            }
            db.query(SQL, function (err, full_final_result) {
                if (err) {
                    res.status(500).json({
                        error: true,
                        success: false,
                        data: err,
                        message: "Something went wrong"
                    });
                } else {
                    var Total = full_final_result.length;
                    var totalPages = Math.ceil(Total / limit);
                    res.status(200).json({
                        success: true,
                        error: false,
                        'page': final_result,
                        'total_pages': totalPages,
                        'total_records': Total
                    });

                }
            });
        }
    });
});

module.exports = router;