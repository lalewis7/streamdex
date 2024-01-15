var util = require('../util.js');

module.exports = {
    
    getSeasonLinks(season_id){
        return util.dbPromise("SELECT * FROM season_available WHERE (season_id, platform, country, timestamp) IN (SELECT season_id, platform, country, max(timestamp) from season_available group by season_id, platform, country) AND season_id = ?", season_id);
    },

    getSeasonPlatformLinks(season_id, platform){
        return util.dbPromise("SELECT * FROM season_available WHERE (season_id, platform, country, timestamp) IN (SELECT season_id, platform, country, max(timestamp) from season_available group by season_id, platform, country) AND season_id = ? AND platform = ?", season_id, platform);
    },

    insertSeasonLink(season_id, platform, country, available, timestamp){
        return util.dbPromise("INSERT INTO season_available (season_id, platform, country, available, timestamp) VALUES (?, ?, ?, ?, ?)", 
            season_id, platform, country, available, timestamp);
    },

    deleteSeaonLink(season_id, platform){
        return util.dbPromise("DELETE FROM season_available WHERE season_id = ? AND platform = ?", season_id, platform);
    },

    deleteAllSeasonLinks(season_id){
        return util.dbPromise("DELETE FROM season_available WHERE season_id = ?", season_id);
    }

}