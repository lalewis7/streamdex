var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getLink(link_id){
        return util.dbPromise("SELECT * FROM botlinks WHERE link_id = ?", link_id);
    },

    getLinks(page = 0){
        return util.dbPromise("SELECT * FROM botlinks LIMIT ? OFFSET ?", config.bot_links_page_length, page);
    },

    searchLinks(search, page = 0){
        return util.dbPromise('SELECT * FROM botlinks WHERE MATCH(link) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.bot_links_page_length, page*config.bot_links_page_length);
    },

    insertLink(link_id, link){
        return util.dbPromise("INSERT INTO botlinks (link_id, link) VALUES (?, ?)", link_id, link);
    },

    updateLink(link_id, link){
        return util.dbPromise("UPDATE botlinks SET link = ? WHERE link_id = ?", link, link_id);
    },

    deleteLink(link_id){
        return util.dbPromise("DELETE FROM botlinks where link_id = ?", link_id);
    }

}