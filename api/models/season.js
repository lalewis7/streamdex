const crypto = require('crypto');

// controllers
const episodeController = require('../controllers/episode.js');
const linkController = require('../controllers/season.links.js');
const seasonController = require('../controllers/season.js');

// models
const model = require('./model.js');
const Episode = require('./episode.js');

// helpers
var config = require('../config.json');

class Season extends model.Model {

    constructor(data){
        super([
            new model.StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "id",
                db_name: "season_id",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.NumberAttribute({
                name: "season_number",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.DateAttribute({
                name: "rel_date",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "trailer",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new SeasonLinksAttribute({
                name: "links",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new EpisodesAttribute({
                name: "episodes",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        // episodes
        const episodes = await episodeController.getSeasonEpisodes(this.get().title_id, this.get().id);
        for (let val of episodes){
            let ep = new Episode(val);
            this.episodes.value.push(ep);
        }
        // links
        const links = await linkController.getSeasonLinks(this.get().title_id, this.get().id);
        for (let val of links){
            let li = new SeasonLink(val);
            this.links.value.push(li);
        }
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let s = this.get();
        await seasonController.insertSeason(s.title_id, s.id, s.season_number, s.rel_date, s.trailer);
    }

    async save(){
        let s = this.get();
        await seasonController.updateSeason(s.title_id, s.id, s.season_number, s.rel_date, s.trailer);
        // episodes
        await episodeController.deleteAllEpisode(s.title_id, s.id);
        for (let e of s.episodes){
            await episodeController.insertEpisode(e.title_id, e.season_id, e.episode_number,e.name, e.runtime, 
                e.description);
        }
        // links
        // delete not included links
        const oldLinks = await linkController.getSeasonLinks(s.title_id, s.id);
        outer: for (let l of oldLinks){
            let lVal = new SeasonLink(l).get();
            for (let val of s.links){
                if (val.platform == lVal.platform)
                    continue outer;
            }
            await linkController.deleteSeaonLink(lVal.title_id, lVal.id, lVal.platform);
        }
        // add / edit new links
        outer: for (let val of s.links){
            for (let oldLink of oldLinks){
                let old = new SeasonLink(oldLink).get();
                // make edits
                if (val.platform == old.platform){
                    await linkController.editSeasonLink(val.title_id, val.season_id, val.platform, val.link, val.available);
                    continue outer;
                }
            }
            // does not yet exist make new one
            await linkController.insertSeasonLink(val.title_id, val.season_id, val.platform, val.link, val.available);
        }
    }

    async delete(){
        let val = this.get();
        await seasonController.deleteSeason(val.title_id, val.id);
        await linkController.deleteAllSeasonLinks(val.title_id, val.id);
        await episodeController.deleteAllEpisode(val.title_id, val.id);
    }

}

class SeasonLink extends model.Model {

    constructor(data){
        super([
            new model.StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new model.NumberAttribute({
                name: "season_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "platform",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "link",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new model.BooleanAttribute({
                name: "available",
                defaultValue: true,
                editable: true,
                visible: false,
                adminProtected: true
            })
        ], data);
    }

}

class EpisodesAttribute extends model.Attribute {

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
                    episode = new Episode({title_id:  model.get().title_id, season_id:  model.get().id});
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

class SeasonLinksAttribute extends model.Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new SeasonLink().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (model, val, requester) => {
            let links = [];
            for (let v of val){
                let link;
                for (let e of model.links.value)
                    if (e.get().platform == v.platform)
                        link = e;
                if (link == undefined)
                    link = new SeasonLink({title_id:  model.get().title_id, season_id: model.get().id});
                link.edit(v, requester);
                links.push(link);
            }
            return links;
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
    return seasonController.getSeasonByID(id).then(seasons => {
        // id does not exist
        if (seasons.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Season