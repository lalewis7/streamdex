var util = require('../util.js');

module.exports = {

    getSeason(title_id, season_id){
        return util.dbPromise("SELECT * FROM seasons WHERE title_id = ? AND season_id = ?", title_id, season_id);
    },

    getAllSeasons(title_id){
        return util.dbPromise("SELECT * FROM seasons WHERE title_id = ?", title_id);
    },

    getSeasonByID(season_id){
        return util.dbPromise("SELECT * FROM seasons WHERE season_id = ?", season_id);
    },

    deleteAllSeasons(title_id){
        return util.dbPromise("DELETE FROM seasons WHERE title_id = ?", title_id);
    },

    deleteSeason(title_id, season_id){
        return util.dbPromise("DELETE FROM seasons WHERE title_id = ? AND season_id = ?", title_id, season_id);
    },

    insertSeason(title_id, season_id, season_number, rel_date, trailer){
        return util.dbPromise("INSERT INTO seasons (title_id, season_id, season_number, rel_date, trailer) VALUES (?, ?, ?, ?, ?)", title_id, season_id, season_number, rel_date, trailer);
    },

    updateSeason(title_id, season_id, season_number, rel_date, trailer){
        return util.dbPromise("UPDATE seasons SET season_number = ?, rel_date = ?, trailer = ? WHERE title_id = ? AND season_id = ?", season_number, rel_date, trailer, title_id, season_id);
    }

}