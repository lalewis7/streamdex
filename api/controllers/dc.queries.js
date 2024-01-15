var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getQuery(query){
        return util.dbPromise("SELECT * FROM bot_queries WHERE query = ?", query);
    },

    getQueries(page = 0){
        return util.dbPromise("SELECT * FROM bot_queries LIMIT ? OFFSET ?", config.bot_links_page_length, page);
    },

    getUnsearchedQueriesForSite(site, page = 0){
        return util.dbPromise("SELECT * FROM bot_queries AS q WHERE q.query NOT IN (SELECT query FROM bot_searches AS s WHERE q.query = s.query AND s.site = ?) LIMIT ? OFFSET ?", site, config.bot_links_page_length, page);
    },

    searchQueries(search, page = 0){
        return util.dbPromise('SELECT * FROM bot_queries WHERE MATCH(query) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.bot_links_page_length, page*config.bot_links_page_length);
    },

    insertQuery(query){
        return util.dbPromise("INSERT INTO bot_queries (query) VALUES (?)", query);
    },

    deleteQuery(query){
        return util.dbPromise("DELETE FROM bot_queries where query = ?", query);
    }

}