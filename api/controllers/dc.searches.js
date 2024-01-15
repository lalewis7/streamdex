var util = require('../util.js');

module.exports = {

    getSearch(query, site){
        return util.dbPromise("SELECT * FROM bot_searches WHERE query = ? AND site = ?", query, site);
    },

    getQuerySearches(query){
        return util.dbPromise("SELECT * FROM bot_searches WHERE query = ?", query);
    },

    insertSearch(query, site, task_id){
        return util.dbPromise("INSERT INTO bot_searches (query, site, task_id) VALUES (?, ?, ?)", query, site, task_id);
    },

    updateSearch(query, site, task_id){
        return util.dbPromise("UPDATE bot_searches SET site = ?, task_id = ? WHERE query = ?", site, task_id, query);
    },

    deleteSearch(query, site){
        return util.dbPromise("DELETE FROM bot_searches WHERE query = ? AND site = ?", query, site);
    },

    deleteAllQuerySearches(query){
        return util.dbPromise("DELETE FROM bot_searches WHERE query = ?", query);
    }

}