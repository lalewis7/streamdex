/*
Controller for authentication queries and everything related.
*/

var util = require('../util.js');

module.exports = {
    /**
     * Finds all tokens with matching token.
     * @param {String} token 
     */
    selectTokensByToken(token){
        return util.dbPromise('SELECT * FROM tokens WHERE token = ?', [token]);
    },

    /**
     * Finds all tokens owned by user.
     * @param {String} user 
     */
    selectUserTokens(user){
        return util.dbPromise('SELECT * FROM tokens WHERE user = ?', [user]);
    },

    /**
     * Finds all tokens owned by user who have not passed expiration date.
     * @param {String} user 
     */
    selectActiveUserTokens(user){
        return util.dbPromise('SELECT * FROM tokens WHERE user = ? AND expires > ?', [user, Date.now()]);
    },

    /**
     * Insert token into database with given values.
     * @param {String} token 
     * @param {String} user 
     * @param {Number} created 
     * @param {Number} expires 
     */
    insertToken(token, user, created, expires){
        return util.dbPromise('INSERT INTO tokens(token, user, created, expires) VALUES (?, ?, ?, ?)', [token, user, created, expires]);
    },

    /**
     * Deletes token with matching token value.
     * @param {String} token 
     */
    deleteTokenByToken(token){
        return util.dbPromise('DELETE FROM tokens WHERE token = ?', [token]);
    },

    /**
     * Deletes all tokens who's expiration date has passed.
     */
    deleteExpiredTokens(){
        return util.dbPromise('DELETE FROM tokens WHERE expires < ?', [Date.now()]);
    },
}