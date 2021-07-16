var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getEpisode(episode_id){
        return util.dbPromise("SELECT * FROM episodes WHERE episode_id = ?", episode_id);
    },

    getSeasonEpisodes(season_id){
        return util.dbPromise("SELECT * FROM episodes WHERE season_id = ? ORDER BY episode_number ASC", season_id);
    },

    insertEpisode(season_id, episode_id, episode_number, name, runtime, description, rel_date){
        return util.dbPromise("INSERT INTO episodes (season_id, episode_id, episode_number, name, runtime, description, rel_date) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            season_id, episode_id, episode_number, name, runtime, description, rel_date);
    },

    updateEpisode(episode_id, episode_number, name, runtime, description, rel_date){
        return util.dbPromise("UPDATE episodes SET episode_number = ?, name = ?, runtime = ?, description = ?, rel_date = ? WHERE episode_id = ?", 
            episode_number, name, runtime, description, rel_date, episode_id);
    },

    editEpisode(season_id, episode_id, episode_number, name, runtime, description, rel_date){
        return util.dbPromise("INSERT INTO episodes (season_id, episode_id, episode_number, name, runtime, description, rel_date) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            season_id, episode_id, episode_number, name, runtime, description, rel_date);
    },

    deleteEpisode(episode_id){
        return util.dbPromise("DELETE FROM episodes WHERE episode_id = ?", episode_id);
    },

    deleteAllEpisode(season_id){
        return util.dbPromise("DELETE FROM episodes WHERE season_id = ?", season_id);
    }

}