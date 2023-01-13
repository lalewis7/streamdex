// controllers
const taskController = require('../controllers/dc.task.js');

// models
const Task = require('../models/task.js');

// helpers
const {taskExists, editModel} = require('./common.js');

function getTasks(query){
    let page = query.p === undefined ? 0 : query.p;
    let status = query.status;
    let controller;
    if (status === undefined || status === null){
        if (query.q === undefined)
            controller = taskController.getTasks(page);
        else 
            controller = taskController.searchTasks(query.q, page);
    } else {
        controller = taskController.getTasksByStatus(status, page);
    }
    let tasks = [];
    return controller
        .then(tasksData => tasks = tasksData.map(task => new Task(task)))
        .then(() => Promise.all(tasks.map(task => task.init())))
        .then(() => tasks.map(task => task.get(true)));
}

function createTask(data, requester){
    let t = new Task();
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
    console.log(data);
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
    getTasks,
    createTask,
    getTask,
    editTask,
    deleteTask
}