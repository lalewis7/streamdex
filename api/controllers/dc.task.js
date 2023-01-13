var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getTask(task_id){
        return util.dbPromise("SELECT * FROM tasks WHERE task_id = ?", task_id);
    },

    getTasks(page = 0){
        return util.dbPromise("SELECT * FROM tasks LIMIT ? OFFSET ?", config.bot_task_page_length, page);
    },

    getTasksByStatus(status, page = 0){
        return util.dbPromise("SELECT * FROM tasks WHERE status = ? AND started IS null LIMIT ? OFFSET ?", status, config.bot_task_page_length, page);
    },

    searchTasks(search, page = 0){
        return util.dbPromise('SELECT * FROM tasks WHERE MATCH(query) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.bot_task_page_length, page*config.bot_task_page_length);
    },

    insertTask(task_id, link_id, type, status, started, ended){
        return util.dbPromise("INSERT INTO tasks (task_id, link_id, type, status, started, ended) VALUES (?, ?, ?, ?, ?, ?)", task_id, link_id, type, status, started, ended);
    },

    editTask(task_id, link_id, type, status, started, ended){
        return util.dbPromise("UPDATE tasks SET link_id = ?, type = ?, status = ?, started = ?, ended = ? WHERE task_id = ?", link_id, type, status, started, ended, task_id);
    },

    deleteTask(task_id){
        return util.dbPromise("DELETE FROM tasks where task_id = ?", task_id);
    }

}