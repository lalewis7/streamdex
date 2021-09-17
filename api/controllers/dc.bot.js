var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getBot(bot_id){
        return util.dbPromise("SELECT * FROM bots WHERE bot_id = ?", bot_id);
    },

    getBots(page = 0){
        return util.dbPromise("SELECT * FROM bots LIMIT ? OFFSET ?", config.bots_page_length, page);
    },

    createBot(bot_id, name, status, curr_process){
        return util.dbPromise("INSERT INTO bots (bot_id, name, status, curr_process) VALUES (?, ?, ?, ?)", bot_id, name, status, curr_process);
    },

    editBot(bot_id, name, status, curr_process){
        return util.dbPromise("UPDATE bots SET name = ?, status = ?, curr_process = ? WHERE bot_id = ?", name, status, curr_process, bot_id);
    },

    deleteBot(bot_id){
        return util.dbPromise("DELETE FROM bots where bot_id = ?", bot_id);
    }

}