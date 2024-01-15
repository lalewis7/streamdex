var util = require('../util.js');

module.exports = {

    getTitleGenres(title_id){
        return util.dbPromise("SELECT * FROM title_genres WHERE title_id=?", title_id);
    },

    insertGenre(title_id, genre){
        return util.dbPromise("INSERT INTO title_genres (title_id, genre) VALUES (?, ?)", title_id, genre);
    },

    deleteGenre(title_id, genre){
        return util.dbPromise("DELETE FROM title_genres WHERE title_id = ? AND genre = ?", title_id, genre);
    },

    deleteAllTitleGenres(title_id){
        return util.dbPromise("DELETE FROM title_genres WHERE title_id = ?", title_id);
    }

}