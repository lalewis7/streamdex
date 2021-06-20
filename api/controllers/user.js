/*
Controller for user queries and everything related.
*/

var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    /* ------------- TOKEN METHODS ------------- */

     findUsersWithEmailPassword(email, password){
        return util.dbPromise('SELECT * FROM users WHERE email = ? AND password = ?', email, password);
    },

    findUsersWithHandlePassword(handle, password){
        return util.dbPromise('SELECT * FROM users WHERE handle = ? AND password = ?', handle, password);
    },

    /* ------------- /users METHODS ------------- */

    findAllUsers(page = 0){
        return util.dbPromise('SELECT * FROM users LIMIT ? OFFSET ?', config.user_page_length, page*config.user_page_length);
    },

    searchAllUsers(search, page = 0){
        return util.dbPromise('SELECT * FROM users WHERE MATCH(handle, email) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT ? OFFSET ?', search, config.user_page_length, page*config.user_page_length);
    },

    insertUser(user_id, handle, email, password, locked, admin){
        return util.dbPromise('INSERT INTO users(user_id, handle, email, password, locked, admin) VALUES (?, ?, ?, ?, ?, ?)', user_id, handle, email, password, locked, admin);
    },

    /* ------------- /users/:userId METHODS ------------- */

    findUsersByID(user_id){
        return util.dbPromise('SELECT * FROM users WHERE user_id = ?', user_id);
    },

    findUsersByHandle(handle){
        return util.dbPromise('SELECT * FROM users WHERE handle = ?', handle);
    },

    updateUserByID(user_id, handle, email, password, locked, admin){
        return util.dbPromise('UPDATE users SET handle = ?, email = ?, password = ?, locked = ?, admin = ? WHERE user_id = ?', handle, email, password, locked ? 1 : 0, admin ? 1 : 0, user_id);
    },

    deleteUser(user_id){
        return util.dbPromise('DELETE FROM users WHERE user_id = ?', user_id);
    }
}