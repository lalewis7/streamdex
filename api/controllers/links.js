var util = require('../util.js');

module.exports = {

    getLink(title_id, platform){
        return util.dbPromise("SELECT * FROM title_links WHERE title_id = ? AND platform = ?", title_id, platform);
    },

    getLinks(title_id){
        return util.dbPromise("SELECT * FROM title_links WHERE title_id = ?", title_id);
    },

    insertLink(title_id, platform, link){
        return util.dbPromise("INSERT INTO title_links (title_id, platform, link) VALUES (?, ?, ?)", title_id, platform, link);
    },

    editLink(title_id, platform, link){
        return util.dbPromise("UPDATE title_links SET link = ? WHERE title_id = ? AND platform = ?", link, title_id, platform);
    },

    deleteLink(title_id, platform){
        return util.dbPromise("DELETE FROM title_links WHERE title_id = ? AND platform = ?", title_id, platform);
    },

    deleteAllLinks(title_id){
        return util.dbPromise("DELETE FROM title_links WHERE title_id = ?", title_id);
    }

}