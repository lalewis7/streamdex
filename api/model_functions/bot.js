// controllers
const botController = require('../controllers/dc.bot.js');

// models
const Bot = require('../models/bot.js');

// helpers
const {botExists, dataMissingParameter, editModel} = require('./common.js');

function createBot(data, requester){
    let b = new Bot();
    return editModel(b, data, requester)
        .then(() => {
            return b.insert();
        })
        .then(() => {
            return b.get().id
        });
}

function editBot(id, data, requester){
    return botExists(id)
        .then(res => {
            let b = new Bot(res[0]);
            return b.init()
                .then(() => {
                    return editModel(b, data, requester);
                })
                .then(() => {
                    return b.save();
                })
        })
}

function getBot(id){
    return botExists(id)
        .then(res => {
            let b = new Bot(res[0]);
            return b.init()
                .then(() => {
                    return b.get(true);
                })
        })
}

function deleteBot(id){
    return botExists(id)
        .then(res => {
            let b = new Bot(res[0]);
            return b.init()
                .then(() => {
                    return b.delete();
                })
        })
}

function getBots(query){
    let page = query.p === undefined ? 0 : query.p;
    let bots = [];
    return botController.getBots(page)
        .then(dbbots => {
            let initPromises = [];
            for (let botData of dbbots){
                let bot = new Bot(botData);
                initPromises.push(bot.init());
                bots.push(bot);
            }
            return Promise.all(initPromises);
        })
        .then(() => {
            let viewable = [];
            bots.map((bot) => {
                viewable.push(bot.get(true));
            })
            return viewable;
        })
}

module.exports = {
    createBot,
    editBot,
    getBot,
    deleteBot,
    getBots
};