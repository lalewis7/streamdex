const crypto = require('crypto');

// controllers
const titleController = require('../controllers/title.js');
const genreController = require('../controllers/title.genre.js');
const linksController = require('../controllers/links.js');
const listTitlesController = require('../controllers/list.titles.js');

// models
const model = require('./model.js');
const {Link, LinksAttribute} = require('../models/links.js');

// helpers
var config = require('../config.json');

class Title extends model.Model {

    constructor(attr = [], data) {
        super([ 
            new model.StringAttribute({
                name: "id",
                db_name: "title_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "title",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "thumbnail",
                db_name: "cover_image",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "maturity",
                db_name: "maturity_rating",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "description",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "imdb_link",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "imdb_rating",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "rotten_tomatoes_link",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "rotten_tomatoes_rating",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new model.NumberAttribute({
                name: "streamdex_rating",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new LinksAttribute({
                name: "links",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new GenresAttribute({
                name: "genres",
                editable: true,
                visible: true,
                adminProtected: true
            }),
        ...attr], data);
    }

    async init(){
        const genres = await genreController.getTitleGenres(this.get().id);
        for (let genre of genres){
            this.genres.value.push(genre.genre);
        }
        // links
        const links = await linksController.getLinks(this.get().id);
        for (let val of links){
            let li = new Link(val);
            this.links.value.push(li);
        }
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let t = this.get();
        await titleController.insertTitle(t.id, t.title, t.thumbnail, t.maturity, t.description, t.imdb_link, t.imdb_rating, t.rotten_tomatoes_link, t.rotten_tomatoes_rating);
        for (let genre of t.genres)
            await genreController.insertGenre(t.id, genre);
    }

    async save(){
        let t = this.get();
        await titleController.updateTitle(t.id, t.title, t.thumbnail, t.maturity, t.description, t.imdb_link, t.imdb_rating, t.rotten_tomatoes_link, t.rotten_tomatoes_rating);
        await genreController.deleteAllTitleGenres(t.id);
        for (let genre of t.genres){
            await genreController.insertGenre(t.id, genre);
        }
    }

    async delete(){
        let t = this.get();
        await genreController.deleteAllTitleGenres(t.id);
        await linksController.deleteAllLinks(t.id);
        await listTitlesController.deleteAllTitles(t.id);
        await titleController.deleteTitle(t.id);
    }

}

class GenresAttribute extends model.Attribute {

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

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.title_id_length).toString('hex');
    return titleController.getTitlesByID(id).then(titles => {
        // id does not exist
        if (titles.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Title