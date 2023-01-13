// controllers
const queryController = require('../controllers/dc.queries.js');

// models
const Query = require('../models/query.js');

// helpers
const {queryExists, editModel} = require('./common.js');

function getQueries(query){
    let page = query.p === undefined ? 0 : query.p;
    let site = query.site;
    let controller;
    let queries = [];
    if (site === undefined || site === null){
        if (query.q === undefined)
            controller = queryController.getQueries(page);
        else 
            controller = queryController.searchQueries(query.q, page);
    } else {
        controller = queryController.getUnsearchedQueriesForSite(site, page);
    }
    return controller.then(dbqueries => {
            let initPromises = [];
            for (let queryData of dbqueries){
                let query = new Query(queryData);
                initPromises.push(query.init());
                queries.push(query);
            }
            return Promise.all(initPromises);
        })
        .then(() => {
            let viewable = [];
            queries.map((query) => {
                viewable.push(query.get(true));
            })
            return viewable;
        })
}

function createQuery(data, requester){
    let q = new Query();
    return editModel(q, data, requester)
        .then(() => {
            return q.insert();
        })
        .then(() => {
            return q.get().query;
        })
}

function getQuery(query){
    return queryExists(query)
        .then(res => {
            let q = new Query(res[0]);
            return q.init()
                .then(() => {
                    return q.get(true);
                })
        })
}

function deleteQuery(query){
    return queryExists(query)
        .then(res => {
            let q = new Query(res[0]);
            return q.init()
                .then(() => {
                    return q.delete();
                })
        })
}

module.exports = {
    getQueries,
    createQuery,
    getQuery,
    deleteQuery,
}