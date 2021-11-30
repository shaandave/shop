
module.exports = {
    checkEmailIsExist: function (email, callback) {
        db.query('SELECT email FROM `users` WHERE email =  ? ', [email], function (err, user_data) {
            return callback(err, user_data);
        });
    },
    createUser: function (insert_array, callback) {
        db.query('INSERT INTO users(name, email, password) VALUES ?', [insert_array], function (err, user_data) {
            return callback(err, user_data);
        });
    },
    checkUser: function (email, callback) {
        db.query('SELECT * FROM `users` WHERE email =  ? ', [email], function (err, user_data) {
            return callback(err, user_data);
        });
    },
}