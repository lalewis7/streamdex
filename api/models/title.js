const crypto = require('crypto');

// controllers
const titleController = require('../controllers/title.js');
const genreController = require('../controllers/title.genre.js');

// models
const model = require('./model.js');

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
    }

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let t = this.get();
        await titleController.insertTitle(t.id, t.title, t.thumbnail, t.maturity, t.description);
    }

    async save(){
        let t = this.get();
        await titleController.updateTitle(t.id, t.title, t.thumbnail, t.maturity, t.description);
        await genreController.deleteAllTitleGenres(t.id);
        for (let genre of t.genres){
            await genreController.insertGenre(t.id, genre);
        }
    }

    async delete(){
        let t = this.get();
        await titleController.deleteTitle(t.id);
        await genreController.deleteAllTitleGenres(t.id);
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