/*
Controller for authentication queries and everything related.
*/

var util = require('../util.js');

module.exports = {
    
    selectTokensByToken(token){
        return util.dbPromise('SELECT * FROM tokens WHERE token = ?', token);
    },

    selectUserTokens(user_id){
        return util.dbPromise('SELECT * FROM tokens WHERE user_id = ?', user_id);
    },

    selectActiveUserTokens(user_id){
        return util.dbPromise('SELECT * FROM tokens WHERE user_id = ? AND expires > ?', user_id, Date.now());
    },

    insertToken(token, user_id, created, expires){
        return util.dbPromise('INSERT INTO tokens(token, user_id, created, expires) VALUES (?, ?, ?, ?)', token, user_id, created, expires);
    },

    deleteTokenByToken(token){
        return util.dbPromise('DELETE FROM tokens WHERE token = ?', token);
    },

    deleteExpiredTokens(){
        return util.dbPromise('DELETE FROM tokens WHERE expires < ?', Date.now());
    },
}