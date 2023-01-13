var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getLink(link_id){
        return util.dbPromise("SELECT * FROM bot_links WHERE link_id = ?", link_id);
    },

    getLinks(page = 0){
        return util.dbPromise("SELECT * FROM bot_links LIMIT ? OFFSET ?", config.bot_links_page_length, page);
    },

    getLinkByLink(link){
        return util.dbPromise("SELECT * FROM bot_links WHERE link = ?", link);
    },

    getLinksThatNeedSnapshot(page = 0){
        return util.dbPromise("SELECT * FROM bot_links AS b WHERE b.link_id NOT IN (SELECT link_id FROM snapshots as S) AND (b.link LIKE 'https://www.rottentomatoes.com/m/%' OR b.link LIKE 'https://www.rottentomatoes.com/tv/%') LIMIT ? OFFSET ?", config.bot_links_page_length, page*config.bot_links_page_length);
    },

    searchLinks(search, page = 0){
        return util.dbPromise('SELECT * FROM bot_links WHERE MATCH(link) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.bot_links_page_length, page*config.bot_links_page_length);
    },

    insertLink(link_id, link){
        return util.dbPromise("INSERT INTO bot_links (link_id, link) VALUES (?, ?)", link_id, link);
    },

    updateLink(link_id, link){
        return util.dbPromise("UPDATE bot_links SET link = ? WHERE link_id = ?", link, link_id);
    },

    deleteLink(link_id){
        return util.dbPromise("DELETE FROM bot_links where link_id = ?", link_id);
    }

}