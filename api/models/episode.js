// controlers
const episodeController = require('../controllers/episode.js');
const linkController = require('../controllers/episode.links.js');

// models
const {Model, StringAttribute, NumberAttribute, DateAttribute} = require('./model.js');
const {AvailabilityAttribute, EpisodeLink, getAvailables} = require('../models/links.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class Episode extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "season_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "id",
                db_name: "episode_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "episode_number",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "name",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "runtime",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "description",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new DateAttribute({
                name: "rel_date",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new AvailabilityAttribute({
                name: "availability",
                editable: false,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        // links
        this.availability.value = getAvailables((await linkController.getEpisodeLinks(this.get().id)).map(link => new EpisodeLink(link)));
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let e = this.get();
        await episodeController.insertEpisode(e.season_id, e.id, e.episode_number, e.name, e.runtime, e.description, e.rel_date);
    }

    async save(){
        let e = this.get();
        await episodeController.updateEpisode(e.id, e.episode_number, e.name, e.runtime, e.description, e.rel_date);
    }

    async delete(){
        let e = this.get();
        await linkController.deleteAllEpisodeLinks(e.id);
        await episodeController.deleteEpisode(e.id);
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.episode_id_length).toString('hex');
    return episodeController.getEpisode(id).then(episodes => {
        // id does not exist
        if (episodes.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Episode;