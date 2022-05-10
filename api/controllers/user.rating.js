/*
Controller for user ratings.
*/

var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    findAllUserRatings(user_id, page = 0){
        return util.dbPromise("SELECT * FROM userratings WHERE user_id=? LIMIT ? OFFSET ?", user_id, config.user_rating_page_length, page*config.user_rating_page_length);
    },

    findUserRating(user_id, title_id){
        return util.dbPromise("SELECT * FROM userratings WHERE user_id=? AND title_id=?", user_id, title_id);
    },

    insertUserRating(user_id, title_id, positive){
        return util.dbPromise("INSERT INTO userratings (user_id, title_id, positive) VALUES (?, ?, ?)", user_id, title_id, positive);
    },

    updateUserRating(user_id, title_id, rating){
        return util.dbPromise('UPDATE userratings SET positive = ? WHERE user_id = ? AND title_id = ?', rating, user_id, title_id);
    },

    deleteUserRating(user_id, title_id){
        return util.dbPromise("DELETE FROM userratings WHERE user_id = ? AND title_id = ?", user_id, title_id);
    }

}