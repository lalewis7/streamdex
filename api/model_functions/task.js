// controllers
const taskController = require('../controllers/dc.task.js');

// models
const Task = require('../models/task.js');

// helpers
const {botExists, taskExists, editModel} = require('./common.js');

function getBotTasks(bot_id){
    return botExists(bot_id)
        .then(() => {
            return taskController.getBotTasks(bot_id);
        })
        .then(tasks => tasks.map(task => new Task(task)))
        .then(tasks => tasks.map(task => task.get()))
}

function createTask(bot_id, data, requester){
    let t = new Task();
    t.override({bot_id: bot_id});
    return editModel(t, data, requester)
        .then(t => t.insert())
        .then(() => t.get().id);
}

function getTask(task_id){
    return taskExists(task_id)
        .then(task => {
            let t = new Task(task[0]);
            return t.get();
        })
}

function editTask(task_id, data, requester){
    let t;
    return taskExists(task_id)
        .then(task => {
            t = new Task(task[0]);
            return editModel(t, data, requester);
        })
        .then(() => {
            t.save();
        })
}

function deleteTask(task_id){
    return taskExists(task_id)
        .then(task => {
            let t = new Task(task[0]);
            return t.delete();
        })
}


module.exports = {
    getBotTasks,
    createTask,
    getTask,
    editTask,
    deleteTask
}