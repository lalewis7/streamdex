var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getSeasonEpisodes(title_id, season_id){
        return util.dbPromise("SELECT * FROM episodes WHERE title_id = ? AND season_id = ?", title_id, season_id);
    },

    insertEpisode(title_id, season_id, episode_number, name, runtime, description){
        return util.dbPromise("INSERT INTO episodes (title_id, season_id, episode_number, name, runtime, description) VALUES (?, ?, ?, ?, ?, ?)", title_id, season_id, episode_number, name, runtime, description);
    },

    deleteAllEpisode(title_id, season_id){
        return util.dbPromise("DELETE FROM episodes WHERE title_id = ? AND season_id = ?", title_id, season_id);
    }

}