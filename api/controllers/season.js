var util = require('../util.js');

module.exports = {

    getSeason(season_id){
        return util.dbPromise("SELECT * FROM seasons WHERE season_id = ?", season_id);
    },

    getAllSeasons(title_id){
        return util.dbPromise("SELECT * FROM seasons WHERE title_id = ? ORDER BY season_number ASC", title_id);
    },

    deleteAllSeasons(title_id){
        return util.dbPromise("DELETE FROM seasons WHERE title_id = ?", title_id);
    },

    deleteSeason(season_id){
        return util.dbPromise("DELETE FROM seasons WHERE season_id = ?", season_id);
    },

    insertSeason(title_id, season_id, season_number, trailer){
        return util.dbPromise("INSERT INTO seasons (title_id, season_id, season_number, trailer) VALUES (?, ?, ?, ?)", title_id, season_id, season_number, trailer);
    },

    updateSeason(season_id, season_number, trailer){
        return util.dbPromise("UPDATE seasons SET season_number = ?, trailer = ? WHERE season_id = ?", season_number, trailer, season_id);
    }

}