var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getTask(task_id){
        return util.dbPromise("SELECT * FROM tasks WHERE task_id = ?", task_id);
    },

    getBotTasks(bot_id){
        return util.dbPromise("SELECT * FROM tasks WHERE bot_id = ?", bot_id);
    },

    insertTask(task_id, bot_id, link_id, type, status, started, ended){
        return util.dbPromise("INSERT INTO tasks (task_id, bot_id, link_id, type, status, started, ended) VALUES (?, ?, ?, ?, ?, ?, ?)", task_id, bot_id, link_id, type, status, started, ended);
    },

    editTask(task_id, bot_id, link_id, type, status, started, ended){
        return util.dbPromise("UPDATE tasks SET bot_id = ?, link_id = ?, type = ?, status = ?, started = ?, ended = ? WHERE task_id = ?", bot_id, link_id, type, status, started, ended, task_id);
    },

    deleteTask(task_id){
        return util.dbPromise("DELETE FROM tasks where task_id = ?", task_id);
    }

}