// controllers
const listController = require('../controllers/list.js');

// models
const List = require('../models/list.js');

// helpers
const {listExists, editModel, dataMissingParameter} = require('./common.js');

function getList(id){
    let list;
    return listExists(id)
        .then(res => {
            list = new List(res[0]);
            return list.init();
        })
        .then(() => {
            return list.get(true);
        })
}

function createList(data, requester){
    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["name"]))
        return Promise.reject("Missing " + param + " parameter.");

    let l = new List();
    return editModel(l, data, requester)
        .then(() => {
            return l.insert();
        })
        .then(() => {
            return l.get().id
        });
}

function editList(id, data, requester){
    let list;
    return listExists(id)
        .then(res => {
            list = new List(res[0]);
            return list.init();
        })
        .then(() => {
            return editModel(list, data, requester);
        })
        .then(() => {
            return list.save();
        })
}

function deleteList(id){
    return listExists(id)
        .then(res => {
            let list = new List(res[0]);
            return list.delete();
        });
}

module.exports = {
    getList,
    createList,
    editList,
    deleteList
}