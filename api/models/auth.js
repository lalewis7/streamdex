const crypto = require('crypto');
var authController = require('../controllers/auth.js');
var userController = require('../controllers/user.js');
var config = require('../config.js');
var util = require('../util.js');

module.exports = {
    /**
     * Gets a users token from login credentials either email and password or handle and password.
     * @param {String} user 
     * @param {String} pass 
     */
    getToken(user, pass){
        var id;
        /*
        1. First check if user exists with email and password.
        2. If not check if user exists with handle and password.
        3. If neither exist throw error that login credentials are incorrect.
        4. Search for existing active (hasn't expired) token matching the user.
        5. If token exists send token to user, if not create new one.
        6. Create random tokens and check to make sure that they do not already exist.
        7. Once new token is found insert into database and return token to user.
        */
        return userController.findUsersWithEmailPassword(user, pass)
            .then(users => {
                // no matches with email & password
                if (users.length == 0)
                    return userController.findUsersWithHandlePassword(user, pass);
                return users;
            })
            .then(users => {
                // no matches with handle and password
                if (users.length == 0)
                    return null;
                return users[0];
            })
            .then(user => {
                if (user === null)
                    throw "Email/Username or password incorrect.";
                id = user.id;
                // search for existing token
                return authController.selectActiveUserTokens(user.id);
            })
            .then(tokens => {
                // does not have active token
                if (tokens.length == 0)
                    // create new token
                    return getNewToken().then(token => {
                        // add to db
                        return authController.insertToken(token, id, Date.now(), Date.now() + config.token_lifetime)
                        .then(() => {return token});
                    });
                return tokens[0].token;
            });
    }
}

/**
 * Creates random token and compares it against the existing tokens until a unique one is made.
 */
function getNewToken(){
    // create random token
    let token = crypto.randomBytes(config.token_length).toString('hex');
    return authController.selectTokensByToken(token).then(tokens => {
        // token does not exist
        if (tokens.length == 0)
            return token;
        // token exists try again
        return getNewToken();
    });
}