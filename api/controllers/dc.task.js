var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getTask(task_id){},

    getBotTasks(bot_id){},

    insertTask(task_id, bot_id, type, data, status, scheduled, started, finished){},

    editTask(task_id, bot_id, type, data, status, scheduled, started, finished){},

    deleteTask(task_id){}

}