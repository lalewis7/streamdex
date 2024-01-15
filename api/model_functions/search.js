// controllers

// models
const Search = require('../models/search.js');

// helpers
const {searchExists, editModel} = require('./common.js');

function createSearch(query, data, requester){
    let s = new Search({query: query});
    return editModel(s, data, requester)
        .then(() => {
            return s.insert();
        })
        .then(() => {
            return s.get(true);
        })
}

function updateSearch(query, site, data, requester){
    return searchExists(query, site)
        .then(res => {
            let s = new Search(res[0]);
            return s.init()
                .then(() => {
                    return editModel(s, data, requester);
                });
        })
        .then(search => {
            return search.save();
        })
}

function getSearch(query, site){
    return searchExists(query, site)
        .then(res => {
            let s = new Search(res[0]);
            return s.init()
                .then(() => {
                    return s.get(true);
                })
        })
}

function deleteSearch(query, site){
    return searchExists(query, site)
        .then(res => {
            let s = new Search(res[0]);
            return s.init()
                .then(() => {
                    return s.delete();
                })
        })
}

module.exports = {
    createSearch,
    updateSearch,
    getSearch,
    deleteSearch,
}