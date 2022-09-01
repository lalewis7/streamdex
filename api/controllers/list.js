var util = require('../util.js');

module.exports = {

    getLists(){
        return util.dbPromise('SELECT * FROM lists');
    },

    getList(list_id){
        return util.dbPromise('SELECT * FROM lists WHERE list_id = ?', list_id);
    },

    insertList(list_id, name, updated){
        return util.dbPromise('INSERT INTO lists (list_id, name, updated) VALUES (?, ?, ?)', list_id, name, updated);
    },

    editList(list_id, name, updated){
        return util.dbPromise('UPDATE lists SET name = ?, updated = ? WHERE list_id = ?', name, updated, list_id);
    },

    deleteList(list_id){
        return util.dbPromise('DELETE FROM lists WHERE list_id = ?', list_id);
    }

}