var userController = require('./controllers/user.js');
var tokenController = require('./controllers/token.js');
var util = require('./util.js');

module.exports = {

    log: function(req, res, next) {
        util.logger().info('%s (%s) %s', req.ip, req.method, req.originalUrl);
        return next();
    },

    isAuthenticated: function(req, res, next) {
        // requires authentication
        if (!req.user)
            return res.sendStatus(401);
        return next();
    },

    isAdmin: function(req, res, next) {
        // requires authorization
        if (!req.user.admin)
            return res.sendStatus(403);
        return next();
    },
    
    getToken: function (req, res, next){
        // get token from header
        let token = req.get('token');
        // no token sent
        if (!token)
            next();
        else
            // find token
            tokenController.selectTokensByToken(token)
                .then(tokens => {
                    // token does not exist
                    if (tokens.length == 0)
                        next();
                    // token expired
                    if (tokens[0].expires < Date.now())
                        next();
                    // find user for token
                    return userController.findUsersByID(tokens[0].user_id);
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
}