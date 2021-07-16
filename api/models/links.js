// controllers
const linksController = require('../controllers/links.js');
const movieLinksController = require('../controllers/movie.links.js');
const seasonLinksController = require('../controllers/season.links.js');
const episodeLinksController = require('../controllers/episode.links.js');

// models
const {Model, Attribute, StringAttribute, BooleanAttribute, NumberAttribute} = require('./model.js');

class Availability extends Model {

    constructor(data) {
        super([
            new StringAttribute({
                name: "platform",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new CountriesAttribute({
                name: "countries",
                editable: true,
                visible: true,
                adminProtected: true,
            })
        ], data);
    }

    init(links) {
        links.map(link => {
            if (link.get().platform === this.get().platform && link.get().available)
                this.countries.value.push(link.get().country);
        })
    }

    // async insert(){}

    // async save(){}

    // async delete(){}

}

class MovieLink extends Model {

    constructor(data) {
        super([
            new StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "platform",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "country",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new BooleanAttribute({
                name: "available",
                defaultValue: true,
                editable: true,
                visible: false,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "timestamp",
                editable: false,
                visible: false,
                adminProteceted: true
            })
        ], data);
    }

    // async init(){}

    async insert(){
        this.override({timestamp: Date.now()});
        let l = this.get();
        await movieLinksController.insertMovieLink(l.title_id, l.platform, l.country, l.available, l.timestamp);
    }

    // async save(){}

    async delete(){
        let l = this.get();
        await movieLinksController.deleteMovieLink(l.title_id, l.platform);
    }

}

class SeasonLink extends Model {

    constructor(data) {
        super([
            new StringAttribute({
                name: "season_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "platform",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "country",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new BooleanAttribute({
                name: "available",
                defaultValue: true,
                editable: true,
                visible: false,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "timestamp",
                editable: false,
                visible: false,
                adminProteceted: true
            })
        ], data);
    }

    // async init(){}

    async insert(){
        this.override({timestamp: Date.now()});
        let l = this.get();
        await seasonLinksController.insertSeasonLink(l.season_id, l.platform, l.country, l.available, l.timestamp);
    }

    // async save(){}

    async delete(){
        let l = this.get();
        await seasonLinksController.deleteSeaonLink(l.season_id, l.platform);
    }

}

class EpisodeLink extends Model {

    constructor(data) {
        super([
            new StringAttribute({
                name: "episode_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "platform",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "country",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new BooleanAttribute({
                name: "available",
                defaultValue: true,
                editable: true,
                visible: false,
                adminProtected: true
            }),
            new NumberAttribute({
                name: "timestamp",
                editable: false,
                visible: false,
                adminProteceted: true
            })
        ], data);
    }

    // async init(){}

    async insert(){
        this.override({timestamp: Date.now()});
        let l = this.get();
        await episodeLinksController.insertEpisodeLink(l.episode_id, l.platform, l.country, l.available, l.timestamp);
    }

    // async save(){}

    async delete(){
        let l = this.get();
        await episodeLinksController.deleteEpisodeLink(l.episode_id, l.platform);
    }

}

class Link extends Model {

    constructor(data){
        super([
            new StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "platform",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "link",
                editable: true,
                visible: true,
                adminProtected: true,
            })
        ], data);
    }

    // async init(){}

    async insert(){
        let l = this.get();
        await linksController.insertLink(l.title_id, l.platform, l.link);
    }

    async save(){
        let l = this.get();
        await linksController.editLink(l.title_id, l.platform, l.link);
    }

    async delete(){
        let l = this.get();
        await linksController.deleteLink(l.title_id, l.platform);
    }

}

class LinksAttribute extends Attribute {

    constructor(conf) {
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Link().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (title, val, requester) => {
            let links = [];
            for (let v of val){
                let link;
                for (let e of title.links.value)
                    if (e.get().platform == v.platform)
                        link = e;
                if (link == undefined)
                    link = new Link({title_id: title.get().title_id});
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

class AvailabilityAttribute extends Attribute {

    constructor(conf) {
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Availability().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (movie, val, requester) => {
            let links = [];
            for (let v of val){
                let link;
                for (let e of movie.links.value)
                    if (e.get().platform == v.platform)
                        link = e;
                if (link == undefined)
                    link = new Availability();
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

class CountriesAttribute extends Attribute {

    constructor(conf){
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (typeof v !== 'string')
                    return false;
            return true;
        };
    }

}

function getAvailables(links){
    let platforms = [];
    links.map(link => {
        if (platforms.indexOf(link.get().platform) < 0)
            platforms.push(link.get().platform);
    });
    let availables = [];
    platforms.map(platform => {
        let available = new Availability({platform: platform});
        available.init(links);
        // add available
        availables.push(available);
    });
    return availables;
}

module.exports = {MovieLink, SeasonLink, EpisodeLink, AvailabilityAttribute, CountriesAttribute, Availability, LinksAttribute, Link, getAvailables}