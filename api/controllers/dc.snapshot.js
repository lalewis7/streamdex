var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getSnapshots(link_id){
        return util.dbPromise("SELECT * FROM snapshots WHERE link_id = ?", link_id);
    },

    getCurrentShapshot(link_id){
        return util.dbPromise("SELECT * FROM snapshots WHERE link_id = ? ORDER BY timestamp DESC LIMIT 1", link_id);
    },

    insertSnapshot(link_id, timestamp, data){
        return util.dbPromise("INSERT INTO snapshots (link_id, timestamp, data) VALUES (?, ?, ?)", link_id, timestamp, data);
    }

}