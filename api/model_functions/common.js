// controllers
const titleController = require('../controllers/title.js');
const movieController = require('../controllers/movie.js');
const seasonController = require('../controllers/season.js');
const episodeController = require('../controllers/episode.js');
const listController = require('../controllers/list.js');
const botController = require('../controllers/dc.bot.js');

function titleExists(id){
    return titleController.getTitlesByID(id)
        .then(res => {
            // title does not exist
            if (res.length == 0)
                return Promise.reject({http_msg: "Title does not exist.", http_code: 404});
            return res;
        })
}

function seasonExists(id){
    return seasonController.getSeason(id)
        .then(res => {
            // season does not exist
            if (res.length == 0)
                return Promise.reject({http_msg: "Season does not exist.", http_code: 404});
            return res;
        })
}

function episodeExists(id){
    return episodeController.getEpisode(id)
        .then(res => {
            // episode does not exist
            if (res.length == 0)
                return Promise.reject({http_msg: "Episode does not exist.", http_code: 404});
            return res;
        })
}

function listExists(id){
    return listController.getList(id)
        .then(res => {
            // list does not exist
            if (res.length == 0)
                return Promise.reject({http_msg: "List does not exist.", http_code: 404});
            return res;
        })
}

function botExists(id){
    return botController.getBot(id)
        .then(res => {
            // bot does not exist
            if (res.length == 0)
                return Promise.reject({http_msg: "Bot does not exist.", http_code: 404});
            return res;
        })
}

function titleIsMovie(id){
    return movieController.selectMoviesByID(id)
        .then(movies => {
            if (movies.length == 0)
                return Promise.reject("Title is not a movie.");
            return movies;
        })
}

function isTitleMovie(id){
    return movieController.selectMoviesByID(id)
        .then(movies => {
            if (movies.length == 0)
                return false;
            return true;
        })
}

function titleIsShow(id){
    return movieController.selectMoviesByID(id)
        .then(movies => {
            if (movies.length > 0)
                return Promise.reject("Title is not a show.");
        })
}

function editModel(model, data, requester){
    return new Promise((res, rej) => {
        let fails = model.edit(data, requester);
        if (fails.length > 0)
            return rej(fails[0] + " parameter invalid.");
        return res(model);
    });
}

function dataMissingParameter(data, params){
    for (let param of params)
        if (data[param] == undefined || data[param] == null)
            return param;
    return undefined;
}

module.exports = {
    titleExists,
    seasonExists,
    episodeExists,
    listExists,
    botExists,
    titleIsMovie,
    isTitleMovie,
    titleIsShow,
    editModel,
    dataMissingParameter
}