// controllers
const movieController = require('../controllers/movie.js');
const linkController = require('../controllers/movie.links.js');

// models
const {DateAttribute, StringAttribute, NumberAttribute} = require('./model.js');
const Title = require('./title.js');
const {MovieLink, AvailabilityAttribute, getAvailables} = require('./links.js');

// helpers
var config = require('../config.json');

class Movie extends Title {

    constructor(data) {
        super([
            new DateAttribute({
                name: "rel_date",
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
            new NumberAttribute({
                name: "runtime",
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
        ], data)
    }

    async init(){
        await super.init();
        // links
        this.availability.value = getAvailables((await linkController.getMovieLinks(this.get().id)).map(link => new MovieLink(link)));
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
    }

    async delete(){
        let val = this.get();
        await linkController.deleteAllMovieLinks(val.id);
        await movieController.deleteMovie(val.id);
        await super.delete();
    }

}

module.exports = Movie;