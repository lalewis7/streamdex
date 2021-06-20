/*
Controller for user streams.
*/

var util = require('../util.js');

module.exports = {

    findAllUserStreams(user_id){
        return util.dbPromise("SELECT * FROM userstreams WHERE user_id=?", user_id);
    },

    insertUserStream(user_id, platform){
        return util.dbPromise("INSERT INTO userstreams (user_id, platform) VALUES (?, ?)", user_id, platform);
    },

    deleteUserStream(user_id, platform){
        return util.dbPromise("DELETE FROM userstreams WHERE user_id = ? AND platform = ?", user_id, platform);
    },

    deleteAllUserStreams(user_id){
        return util.dbPromise("DELETE FROM userstreams WHERE user_id = ?", user_id);
    }

}