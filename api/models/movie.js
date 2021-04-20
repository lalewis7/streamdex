var movieController = require('../controllers/movie.js');
var model = require('./model.js');
var config = require('../config.js');

module.exports = {
    Movie: class Movie extends model.Model {
        constructor(data) {
            super([
                model.getAttributeConfig('id', false, true, true, ''),
                model.getAttributeConfig('title', true, true, true, ''),
                model.getAttributeConfig('mpaa', true, true, true, ''),
                model.getAttributeConfig('year', true, true, true, 0),
                model.getAttributeConfig('trailer', true, true, true, ''),
                model.getAttributeConfig('runtime', true, true, true, 0),
                model.getAttributeConfig('links', true, true, true, []),
                model.getAttributeConfig('tags', true, true, true, []),
                model.getAttributeConfig('description', true, true, true, '')
            ], data);
        }
    },

    getMovie(id){
        var movie = new this.Movie();
        // search for movies
        return movieController.selectMoviesByID(id)
            .then(movies => {
                // check if movie exists
                if (movies.length == 0)
                    throw "Movie does not exists.";
                movie.forceEdit(movies[0]);
                return movieController.selectMovieLinksByMovie(movie.get().id);
            })
            // add links
            .then(links => {
                var linkData = [];
                // format link data
                links.map(link => {
                    linkData.push({platform: link.platform, link: link.link, cost: link.cost});
                });
                // add to movie obj
                movie.forceEdit({links: linkData});
                return movieController.selectMovieTagsByID(id);
            })
            // add tags
            .then(tags => {
                var tagData = [];
                // format tag data
                tags.map(tag => {
                    tagData.push(tag.tag);
                });
                // add tags to movie obj
                movie.forceEdit({tags: tagData});
                return movie.getViewable();
            })
    },

    createMovie(data, admin){
        // check that all parameters exist
        if (!data.title)
            throw "Missing title parameter.";
        if (!data.mpaa)
            throw "Missing mpaa parameter.";
        if (!data.year)
            throw "Missing year parameter.";
        if (!data.trailer)
            throw "Missing trailer parameter.";
        if (!data.runtime)
            throw "Missing runtime parameter.";
        if (!data.description)
            throw "Missing description patameter.";
        // check that all data is valid ? - TODO
        // create movie object
        var movie = new Movie();
        // edit data
        movie.edit(data, admin);
        // get new id
        return getNewID()
            .then(id => {
                // add id
                movie.forceEdit({id: id});
                // get data
                var movieData = movie.get();
                // insert movie
                return movieController.insertMovie(movieData.id, movieData.title, movieData.mpaa, movieData.year, movieData.trailer, movieData.runtime);
            });
    },

    editMovie(movie){},

    deleteMovie(id){},

    addMovieLink(data, admin){
        
    }
}

/**
 * Creates random id that has not already been assigned to a movie.
 */
function getNewID(){
    // create random id
    let id = 'm'+crypto.randomBytes(config.title_id_length).toString('hex');
    return movieController.selectMoviesByID(id).then(movs => {
        // id does not exist
        if (movs.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}