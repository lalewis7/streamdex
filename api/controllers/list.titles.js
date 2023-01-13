var util = require('../util.js');

module.exports = {

    getListTitles(list_id){
        return util.dbPromise("SELECT * FROM list_titles WHERE list_id = ? ORDER BY ranking ASC", list_id);
    },

    getTitleLists(title_id){
        return util.dbPromise("SELECT * FROM list_titles WHERE title_id = ?", title_id);
    },

    insertListTitle(list_id, title_id, ranking){
        return util.dbPromise("INSERT INTO list_titles (list_id, title_id, ranking) VALUES (?, ?, ?)", list_id, title_id, ranking);
    },

    editListTitle(list_id, title_id, ranking){
        return util.dbPromise("UPDATE list_titles SET ranking = ? WHERE list_id = ? AND title_id = ?", ranking, list_id, title_id);
    },

    deleteListTitle(list_id, title_id){
        return util.dbPromise("DELETE FROM list_titles WHERE list_id = ? AND title_id = ?", list_id, title_id);
    },

    deleteAllListTitles(list_id){
        return util.dbPromise("DELETE FROM list_titles WHERE list_id = ?", list_id);
    },

    deleteAllTitles(title_id){
        return util.dbPromise("DELETE FROM list_titles WHERE title_id = ?", title_id)
    }

}