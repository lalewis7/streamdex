const util = require('../util.js');

module.exports = {
    
    selectMoviesByID(title_id){
        return util.dbPromise('SELECT * FROM movies WHERE title_id = ?', title_id);
    },

    insertMovie(title_id, rel_date, trailer, runtime){
        return util.dbPromise("INSERT INTO movies (title_id, rel_date, trailer, runtime) VALUES (?,?,?,?)", title_id, rel_date, trailer, runtime);
    },

    updateMovie(title_id, rel_date, trailer, runtime) {
        return util.dbPromise("UPDATE movies SET rel_date = ?, trailer = ?, runtime = ? WHERE title_id = ?", rel_date, trailer, runtime, title_id);
    },

    deleteMovie(title_id){
        return util.dbPromise("DELETE FROM movies WHERE title_id = ?", title_id);
    }

}