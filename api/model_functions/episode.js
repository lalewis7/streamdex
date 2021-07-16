// controllers
const linksController = require('../controllers/episode.links.js');

// models
const Episode = require('../models/episode.js');
const {EpisodeLink, Availability, getAvailables} = require('../models/links.js');

// helpers
const {episodeExists, editModel, dataMissingParameter} = require('./common.js');

function getEpisode(id){
    let episode;
    return episodeExists(id)
        .then(res => {
            episode = new Episode(res[0]);
            return episode.init();
        })
        .then(() => {
            return episode.get(true);
        })
}

function editEpisode(id, data, requester){
    return episodeExists(id)
        .then(res => {
            let episode = new Episode(res[0]);
            return editModel(episode, data, requester);
        })
        .then(episode => {
            return episode.save();
        })
}

function deleteEpisode(id){
    return episodeExists(id)
        .then(res => {
            let episode = new Episode(res[0]);
            return episode.delete();
        })
}

function getAvailability(id){
    // check title exists
    return episodeExists(id)
        .then(() => {
            return linksController.getEpisodeLinks(id);
        })
        .then(links => {
            return getAvailables(links.map(li => new EpisodeLink(li))).map(available => available.get(true));
        });
}

function getPlatformAvailability(id){
    // check title exists
    return episodeExists(id)
        .then(() => {
            return linksController.getEpisodePlatformLinks(id, platform);
        })
        .then(links => {
            let available = new Availability({platform: platform});
            available.init(links.map(li => new EpisodeLink(li)));
            return available.get(true);
        })
}

function createPlatformAvailability(id, platform, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["country", "available"]))
        return Promise.reject("Missing " + param + " parameter.");

    // check title exists
    return episodeExists(id)
        .then(() => {
            let link = new EpisodeLink({episode_id: id, platform: platform});
            return editModel(link, data, requester);
        })
        .then(link => {
            return link.insert();
        })
}

module.exports = {
    getEpisode,
    editEpisode,
    deleteEpisode,
    getAvailability,
    getPlatformAvailability,
    createPlatformAvailability
}