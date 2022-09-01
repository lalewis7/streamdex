// controllers
const linkController = require('../controllers/dc.links.js');

// models
const BotLinks = require('../models/botlinks.js');

// helpers
const {botLinkExists, dataMissingParameter, editModel} = require('./common.js');

function getLinks(query){
    let page = query.p === undefined ? 0 : query.p;
    let links = [];
    return linkController.getLinks(page)
        .then(dblinks => {
            let initPromises = [];
            for (let linkData of dblinks){
                let link = new BotLinks(linkData);
                initPromises.push(link.init());
                links.push(link);
            }
            return Promise.all(initPromises);
        })
        .then(() => {
            let viewable = [];
            links.map((link) => {
                viewable.push(link.get(true));
            })
            return viewable;
        })
}

function createLink(data, requester){
    let l = new BotLinks();
    return editModel(l, data, requester)
        .then(() => {
            return l.insert();
        })
        .then(() => {
            return l.get().id;
        })
}

function getLink(id){
    return botLinkExists(id)
        .then(res => {
            let l = new BotLinks(res[0]);
            return l.init()
                .then(() => {
                    return l.get(true);
                })
        })
}

function editLink(id, data, requester){
    return botLinkExists(id)
        .then(res => {
            let l = new BotLinks(res[0]);
            return l.init()
                .then(() => {
                    return editModel(l, data, requester);
                })
                .then(() => {
                    return l.save();
                })
        })
}

function deleteLink(id){
    return botLinkExists(id)
        .then(res => {
            let l = new BotLinks(res[0]);
            return l.init()
                .then(() => {
                    return l.delete();
                })
        })
}

module.exports = {
    getLinks,
    createLink,
    getLink,
    editLink,
    deleteLink,
}