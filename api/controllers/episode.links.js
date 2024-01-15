const util = require('../util.js');

module.exports = {

    getEpisodeLinks(episode_id){
        return util.dbPromise("SELECT * FROM episode_available WHERE (episode_id, platform, country, timestamp) IN (SELECT episode_id, platform, country, max(timestamp) from episode_available group by episode_id, platform, country) AND episode_id = ?", episode_id);
    },

    getEpisodePlatformLinks(episode_id, platform){
        return util.dbPromise("SELECT * FROM episode_available WHERE (episode_id, platform, country, timestamp) IN (SELECT episode_id, platform, country, max(timestamp) from episode_available group by episode_id, platform, country) AND episode_id = ? AND platform = ?", episode_id, platform);
    },

    insertEpisodeLink(episode_id, platform, country, available, timestamp){
        return util.dbPromise("INSERT INTO episode_available (episode_id, platform, country, available, timestamp) VALUES (?, ?, ?, ?, ?)", episode_id, platform, country, available, timestamp);
    },

    deleteEpisodeLink(episode_id, platform){
        return util.dbPromise("DELETE FROM episode_available WHERE episode_id = ? AND platform = ?", episode_id, platform);
    },

    deleteAllEpisodeLinks(episode_id){
        return util.dbPromise("DELETE FROM episode_available WHERE episode_id = ?", episode_id);
    }

}