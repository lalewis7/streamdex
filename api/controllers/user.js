/*
Controller for user queries and everything related.
*/

var util = require('../util.js');

module.exports = {
    /**
     * Finds all users in database.
     */
    findAllUsers(){
        return util.dbPromise('SELECT * FROM users', []);
    },

    /**
     * Finds all users with matching id.
     * @param {String} id 
     */
    findUsersByID(id){
        return util.dbPromise('SELECT * FROM users WHERE id = ?', [id]);
    },

    /**
     * Finds all users with a matching handle.
     * @param {String} handle 
     */
    findUsersByHandle(handle){
        return util.dbPromise('SELECT * FROM users WHERE handle = ?', [handle]);
    },

    /**
     * Finds all users with matching email and password.
     * @param {String} email 
     * @param {String} password 
     */
    findUsersWithEmailPassword(email, password){
        return util.dbPromise('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    },

    /**
     * Finds all users with matching handle and password.
     * @param {String} handle 
     * @param {String} password 
     */
    findUsersWithHandlePassword(handle, password){
        return util.dbPromise('SELECT * FROM users WHERE handle = ? AND password = ?', [handle, password]);
    },

    /**
     * Updates user information with matching id.
     * @param {String} id 
     * @param {String} handle 
     * @param {String} email 
     * @param {Boolean} email_ver 
     * @param {String} password 
     * @param {Boolean} admin 
     */
    updateUserByID(id, handle, email, email_ver, password, admin){
        return util.dbPromise('UPDATE users SET handle = ?, email = ?, email_ver = ?, password = ?, admin = ? WHERE id = ?', [handle, email, email_ver, password, admin, id]);
    },

    /**
     * Inserts user into database with given values.
     * @param {String} id 
     * @param {String} handle 
     * @param {String} email 
     * @param {Boolean} email_ver 
     * @param {String} password 
     * @param {Boolean} admin 
     */
    insertUser(id, handle, email, email_ver, password, admin){
        return util.dbPromise('INSERT INTO users(id, handle, email, email_ver, password, admin) VALUES (?, ?, ?, ?, ?, ?)', [id, handle, email, email_ver, password, admin]);
    },

    /**
     * Deletes users with matching id.
     * @param {String} id 
     */
    deleteUser(id){
        return util.dbPromise('DELETE FROM users WHERE id = ?', [id]);
    }
}