// controllers
const linksController = require('../controllers/season.links.js');
const episodeController = require('../controllers/episode.js');

// models
const Season = require('../models/season.js');
const Episode = require('../models/episode.js');
const {SeasonLink, Availability, getAvailables} = require('../models/links.js');

// helpers
const {seasonExists, editModel, dataMissingParameter} = require('./common.js');

function getSeason(id){
    let season;
    return seasonExists(id)
        .then(res => {
            season = new Season(res[0]);
            return season.init();
        })
        .then(() => {
            return season.get(true);
        })
}

function editSeason(id, data, requester){
    return seasonExists(id)
        .then(res => {
            let season = new Season(res[0]);
            return editModel(season, data, requester);
        })
        .then(season => {
            return season.save();
        })
}

function deleteSeason(id){
    return seasonExists(id)
        .then(res => {
            let season = new Season(res[0]);
            return season.delete();
        })
}

function getAvailability(id){
    // check title exists
    return seasonExists(id)
        .then(() => {
            return linksController.getSeasonLinks(id);
        })
        .then(links => {
            return getAvailables(links.map(li => new SeasonLink(li))).map(available => available.get(true));
        });
}

function getPlatformAvailability(id, platform){
    // check title exists
    return seasonExists(id)
        .then(() => {
            return linksController.getSeasonPlatformLinks(id, platform);
        })
        .then(links => {
            let available = new Availability({platform: platform});
            available.init(links.map(li => new SeasonLink(li)));
            return available.get(true);
        })
}

function createPlatformAvailability(id, platform, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["country", "available"]))
        return Promise.reject("Missing " + param + " parameter.");
    
    // check title exists
    return seasonExists(id)
        .then(() => {
            let link = new SeasonLink({season_id: id, platform: platform});
            return editModel(link, data, requester);
        })
        .then(link => {
            return link.insert();
        })
}

function getEpisodes(id){
    let episodes = [];
    return seasonExists(id)
        .then(() => {
            return episodeController.getSeasonEpisodes(id);
        })
        .then(episodesData => {
            episodes = episodesData.map(episode => new Episode(episode));
            let promises = [];
            episodes.map(episode => promises.push(episode.init()));
            return Promise.all(promises);
        })
        .then(() => {
            return episodes.map(episode => episode.get(true));
        })
}

function createEpisode(id, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["episode_number"]))
        return Promise.reject("Missing " + param + " parameter.");

    // check title exists
    let episode;
    return seasonExists(id)
        .then(() => {
            episode = new Episode({season_id: id});
            return editModel(episode, data, requester);
        })
        .then(episode => {
            return episode.insert();
        })
        .then(() => {
            return episode.get().id;
        })
}

module.exports = {
    getSeason,
    editSeason,
    deleteSeason,
    getAvailability,
    getPlatformAvailability,
    createPlatformAvailability,
    getEpisodes,
    createEpisode
}