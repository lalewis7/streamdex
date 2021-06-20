// controllers
const movieController = require('../controllers/movie.js');
const linkController = require('../controllers/movie.links.js');

// models
const model = require('./model.js');
const Title = require('./title.js');

// helpers
var config = require('../config.json');

class Movie extends Title {

    constructor(data) {
        super([
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
            new model.NumberAttribute({
                name: "runtime",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new MovieLinksAttribute({
                name: "links",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data)
    }

    async init(){
        await super.init();
        // links
        const links = await linkController.getMovieLinks(this.get().id);
        for (let val of links){
            let li = new MovieLink(val);
            this.links.value.push(li);
        }
    }

    async insert(){
        await super.insert();
        let m = this.get();
        await movieController.insertMovie(m.id, m.rel_date, m.trailer, m.runtime);
    }

    async save(){
        await super.save();
        let m = this.get();
        await movieController.updateMovie(m.id, m.rel_date, m.trailer, m.runtime);
        // links
        // delete not included links
        const oldLinks = await linkController.getMovieLinks(m.id);
        outer: for (let l of oldLinks){
            let lVal = new MovieLink(l).get();
            for (let val of m.links){
                if (val.platform == lVal.platform)
                    continue outer;
            }
            await linkController.deleteMovieLink(lVal.title_id, lVal.platform);
        }
        // add / edit new links
        outer: for (let val of m.links){
            for (let oldLink of oldLinks){
                let old = new MovieLink(oldLink).get();
                // make edits
                if (val.platform == old.platform){
                    await linkController.editMovieLink(val.title_id, val.platform, val.link, val.available);
                    continue outer;
                }
            }
            // does not yet exist make new one
            await linkController.insertMovieLink(val.title_id, val.platform, val.link, val.available);
        }
    }

    async delete(){
        await super.delete();
        let val = this.get();
        await movieController.deleteMovie(val.id);
        await linkController.deleteAllMovieLinks(val.id);
    }

}

class MovieLink extends model.Model {

    constructor(data) {
        super([
            new model.StringAttribute({
                name: "title_id",
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
            }),
        ], data);
    }

}

class MovieLinksAttribute extends model.Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new MovieLink().validate(v, {admin: true}))
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
                    link = new MovieLink({title_id:  model.get().id});
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

module.exports = Movie;