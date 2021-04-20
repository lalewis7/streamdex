var userController = require('./controllers/user.js');
var authController = require('./controllers/auth.js');
var util = require('./util.js');

/**
 * Middleware that looks up the user when they send in a token.
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
module.exports = function (req, res, next){
    // log
    util.logger().info('%s (%s) %s', req.ip, req.method, req.originalUrl);
    // get token from header
    var token = req.get('token');
    // no token sent
    if (!token)
        next();
    else
        // find token
        authController.selectTokensByToken(token)
            .then(tokens => {
                // token does not exist
                if (tokens.length == 0)
                    next();
                // find user for token
                return userController.findUsersByID(tokens[0].user);
            })
            .then(users => {
                // user does not exist
                if (users.length == 0)
                    next();
                // add user to request object
                req.user = users[0];
                next();
            })
            .catch(err => {
                util.logger().error(err);
                next();
            });
}