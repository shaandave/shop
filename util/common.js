var jwt = require('jsonwebtoken');
module.exports = {
get_jwt_token: function (user_id, email, callback) {
        try {
            return callback(null, jwt.sign({
                user_id: user_id,
                email: email,
            }, process.env.JWT_SECRET_TOKEN))
        } catch (err) {
            return callback(err, null);
        }
},
}