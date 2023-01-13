/*
Controller for user streams.
*/

var util = require('../util.js');

module.exports = {

    findAllUserStreams(user_id){
        return util.dbPromise("SELECT * FROM user_streams WHERE user_id=?", user_id);
    },

    insertUserStream(user_id, platform){
        return util.dbPromise("INSERT INTO user_streams (user_id, platform) VALUES (?, ?)", user_id, platform);
    },

    deleteUserStream(user_id, platform){
        return util.dbPromise("DELETE FROM user_streams WHERE user_id = ? AND platform = ?", user_id, platform);
    },

    deleteAllUserStreams(user_id){
        return util.dbPromise("DELETE FROM user_streams WHERE user_id = ?", user_id);
    }

}