const crypto = require('crypto');

// controllers
const episodeController = require('../controllers/episode.js');
const linkController = require('../controllers/season.links.js');
const seasonController = require('../controllers/season.js');

// models
const {Model, Attribute, StringAttribute, NumberAttribute} = require('./model.js');
const Episode = require('./episode.js');
const {AvailabilityAttribute, SeasonLink, getAvailables} = require('../models/links.js');

// helpers
var config = require('../config.json');

class Season extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "id",
                db_name: "season_id",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "season_number",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "trailer",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new AvailabilityAttribute({
                name: "availability",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new EpisodesAttribute({
                name: "episodes",
                editable: false,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        // episodes
        const episodes = await episodeController.getSeasonEpisodes(this.get().id);
        for (let val of episodes){
            let ep = new Episode(val);
            await ep.init();
            this.episodes.value.push(ep);
        }
        // links
        this.availability.value = getAvailables((await linkController.getSeasonLinks(this.get().id)).map(link => new SeasonLink(link)));
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let s = this.get();
        await seasonController.insertSeason(s.title_id, s.id, s.season_number, s.trailer);
    }

    async save(){
        let s = this.get();
        await seasonController.updateSeason(s.id, s.season_number, s.trailer);
    }

    async delete(){
        let val = this.get();
        await seasonController.deleteSeason(val.id);
        await linkController.deleteAllSeasonLinks(val.id);
        await episodeController.deleteAllEpisode(val.id);
    }

}

class EpisodesAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Episode().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (model, val, requester) => {
            let episodes = [];
            for (let v of val){
                let episode;
                for (let e of model.episodes.value)
                    if (e.get().episode_number == v.episode_number)
                        episode = e;
                if (episode == undefined)
                    episode = new Episode({season_id:  model.get().id});
                episode.edit(v, requester);
                episodes.push(episode);
            }
            return episodes;
        }
    }

    getValue(visibleOnly){
        let vals = [];
        for (let val of this.value)
            vals.push(val.get(visibleOnly));
        return vals;
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.season_id_length).toString('hex');
    return seasonController.getSeason(id).then(seasons => {
        // id does not exist
        if (seasons.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Season