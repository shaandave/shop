module.exports = {
    createProduct: function (insert_array, callback) {
        db.query('INSERT INTO `product` (`name`, `image`, `product_code`, `price`, `category`, `manufacture_date`, `expiry_date`, `owner`, `status`) VALUES ?', [insert_array], function (err, user_data) {
            return callback(err, user_data);
        });
    },
    checkProductIsExistByID: function (id, user_id, callback) {
        db.query('SELECT id FROM `product` WHERE id =  ? AND owner = ?', [id, user_id], function (err, user_data) {
            return callback(err, user_data);
        });
    },
    checkPriceUpdationCorrect: function (updated_price, product_id, callback) {
        // db.query('SELECT IF( ((price*10)/100 + price) > '+ updated_price +' AND (price - (price*10)/100) < '+updated_price+' , 1 , ) FROM product Where id ='+product_id, function (err, rows, filed) {
        //     console.log(rows.length, "-------------------")
        //     return callback(err, user_data);
        // });
        db.query('SELECT price FROM `product` where id = ?',[product_id], function (err, product_price) {
            const checkflag = checkPriceCorrect(product_price, updated_price);
            return callback(err, checkflag);
        });
    },
    updateProduct : function(update_array, id, callback) {
        db.query('UPDATE `product` SET `name`=?, `image`=?, `product_code` = ?, `price` = ?, `category` = ?, `expiry_date` = ?, `status` = ? WHERE `id` =' + id, update_array, function (err, product_data) {
            return callback(err, product_data);
        });
    },
    deleteproduct : function(id, callback) {
        db.query('DELETE FROM product WHERE id = ?', [id], function (err, category_data) {
            return callback(err, category_data);
        });
    },
    getAllProducts : function(callback) {
        db.query('SELECT * FROM `product`', function (err, category_data) {
            return callback(err, category_data);
        });
    }
}

function checkPriceCorrect(price_data, updated_price) {
    const result = Object.values(JSON.parse(JSON.stringify(price_data)));
    let price = result[0]['price'];
    if((((price*10)/100 + price) > updated_price && (price - (price*10)/100) < updated_price)) {
        return true;
    }
    return false;
}