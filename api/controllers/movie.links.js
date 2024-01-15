const util = require('../util.js');

module.exports = {

    getMovieLinks(title_id){
        return util.dbPromise("SELECT * FROM movie_available WHERE (title_id, platform, country, timestamp) IN (SELECT title_id, platform, country, max(timestamp) from movie_available group by title_id, platform, country) AND title_id = ?", title_id);
    },

    getMoviePlatformLinks(title_id, platform){
        return util.dbPromise("SELECT * FROM movie_available WHERE (title_id, platform, country, timestamp) IN (SELECT title_id, platform, country, max(timestamp) from movie_available group by title_id, platform, country) AND title_id = ? AND platform = ?", title_id, platform);
    },

    // no need to edit just add another entry with more recent timestamp
    // editMovieLink(title_id, platform, country, available, timestamp){
    //     return util.dbPromise("UPDATE movielinks SET platform = ?, link = ?, available = ? WHERE title_id = ?", platform, link, available, title_id);
    // },

    insertMovieLink(title_id, platform, country, available, timestamp){
        return util.dbPromise("INSERT INTO movie_available (title_id, platform, country, available, timestamp) VALUES (?, ?, ?, ?, ?)", title_id, platform, country, available, timestamp);
    },

    deleteMovieLink(title_id, platform){
        return util.dbPromise("DELETE FROM movie_available WHERE title_id = ? AND platform = ?", title_id, platform);
    },

    deleteAllMovieLinks(title_id){
        return util.dbPromise("DELETE FROM movie_available WHERE title_id = ?", title_id);
    }

}