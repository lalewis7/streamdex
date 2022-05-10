var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getTask(task_id){
        return util.dbPromise("SELECT * FROM tasks WHERE task_id = ?", task_id);
    },

    getBotTasks(bot_id){
        return util.dbPromise("SELECT * FROM tasks WHERE bot_id = ?", bot_id);
    },

    insertTask(task_id, bot_id, type, status, started, finished){
        return util.dbPromise("INSERT INTO tasks (task_id, bot_id, type, status, started, finished) VALUES (?, ?, ?, ?, ?, ?)", task_id, bot_id, type, status, started, finished);
    },

    editTask(task_id, bot_id, type, status, started, finished){
        return util.dbPromise("UPDATE tasks SET bot_id = ?, type = ?, status = ?, started = ?, finished = ? WHERE task_id = ?", bot_id, type, status, started, finished, task_id);
    },

    deleteTask(task_id){
        return util.dbPromise("DELETE FROM tasks where task_id = ?", task_id);
    }

}