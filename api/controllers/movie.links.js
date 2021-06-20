const util = require('../util.js');

module.exports = {

    getMovieLinks(title_id){
        return util.dbPromise("SELECT * FROM movielinks WHERE title_id = ?", title_id);
    },

    editMovieLink(title_id, platform, link, available){
        return util.dbPromise("UPDATE movielinks SET platform = ?, link = ?, available = ? WHERE title_id = ?", platform, link, available, title_id);
    },

    insertMovieLink(title_id, platform, link, available){
        return util.dbPromise("INSERT INTO movielinks (title_id, platform, link, available) VALUES (?, ?, ?, ?)", title_id, platform, link, available);
    },

    deleteMovieLink(title_id, platform){
        return util.dbPromise("DELETE FROM movielinks WHERE title_id = ? AND platform = ?", title_id, platform);
    },

    deleteAllMovieLinks(title_id){
        return util.dbPromise("DELETE FROM movielinks WHERE title_id = ?", title_id);
    }

}