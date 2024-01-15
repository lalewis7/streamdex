var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getSnapshots(link_id){
        return util.dbPromise("SELECT s.link_id, s.task_id, s.data FROM snapshots AS s LEFT JOIN tasks AS t ON s.task_id = t.task_id WHERE s.link_id = ? ORDER BY t.ended DESC", link_id);
    },

    getCurrentShapshot(link_id){
        return util.dbPromise("SELECT s.link_id, s.task_id, s.data FROM snapshots AS s LEFT JOIN tasks AS t ON s.task_id = t.task_id WHERE s.link_id = ? ORDER BY t.ended DESC LIMIT 1", link_id);
    },

    insertSnapshot(link_id, task_id, data){
        return util.dbPromise("INSERT INTO snapshots (link_id, task_id, data) VALUES (?, ?, ?)", link_id, task_id, data);
    },

    getSnapshot(task_id){
        return util.dbPromise("SELECT * FROM snapshots WHERE task_id = ?", task_id);
    },

    updateSnapshot(task_id, data){
        return util.dbPromise("UPDATE snapshots SET data = ? WHERE task_id = ?", data, task_id);
    },

    deleteSnapshot(task_id){
        return util.dbPromise("DELETE FROM snapshots WHERE task_id = ?", task_id);
    }

}