// models
const Bot = require('../models/bot.js');

// helpers
const {botExists, dataMissingParameter, editModel} = require('./common.js');

function getBotConfiguration(){
    let b = new Bot();
    return b.init()
        .then(() => {
            return b.get(true);
        })
}

function editBotConfiguration(data, requester){
    let b = new Bot();
    return b.init()
        .then(() => {
            return editModel(b, data, requester);
        })
        .then(() => {
            return b.save();
        })
}

module.exports = {
    getBotConfiguration,
    editBotConfiguration
};