var util = require('../util.js');

module.exports = {
    
    getSeasonLinks(title_id, season_id){
        return util.dbPromise("SELECT * FROM seasonlinks WHERE title_id = ? AND season_id = ?", title_id, season_id);
    },

    editSeasonLink(title_id, season_id, platform, link, available){
        return util.dbPromise("UPDATE seasonlinks SET platform = ?, link = ?, available = ? WHERE title_id = ? AND season_id = ?", platform, link, available, title_id, season_id);
    },

    insertSeasonLink(title_id, season_id, platform, link, available){
        return util.dbPromise("INSERT INTO seasonlinks (title_id, season_id, platform, link, available) VALUES (?, ?, ?, ?, ?)", title_id, season_id, platform, link, available);
    },

    deleteSeaonLink(title_id, season_id, platform){
        return util.dbPromise("DELETE FROM seasonlinks WHERE title_id = ? AND season_id = ? AND platform = ?", title_id, season_id, platform);
    },

    deleteAllSeasonLinks(title_id, season_id){
        return util.dbPromise("DELETE FROM seasonlinks WHERE title_id = ? AND season_id = ?", title_id, season_id);
    }

}