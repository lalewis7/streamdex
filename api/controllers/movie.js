/*
Controllers for movies and all movie related sql queries
*/

var util = require('../util.js');

module.exports = {
    /**
     * Finds all movies with a matching id.
     * @param {String} id movie id
     */
    selectMoviesByID(id){
        return util.dbPromise('SELECT * FROM movies WHERE id = ?', [id]);
    },

    /**
     * Update movie with matching id.
     * @param {String} id 
     * @param {String} title 
     * @param {String} mpaa 
     * @param {Number} year 
     * @param {String} trailer 
     * @param {Number} runtime 
     * @param {String} description
     */
    updateMovie(id, title, mpaa, year, trailer, runtime, description){
        return util.dbPromise('UPDATE movies SET title = ?, mpaa = ?, year = ?, trailer = ?, runtime = ?, description = ? WHERE id = ?', [title, mpaa, year, trailer, runtime, description, id]);
    },

    /**
     * Insert movie into database with data given.
     * @param {String} id 
     * @param {String} title 
     * @param {String} mpaa 
     * @param {Number} year 
     * @param {String} trailer 
     * @param {Number} runtime 
     * @param {String} description
     */
    insertMovie(id, title, mpaa, year, trailer, runtime, description){
        return util.dbPromise('INSERT INTO movies(id, title, mpaa, year, trailer, runtime, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, title, mpaa, year, trailer, runtime, description]);
    },

    /**
     * Deletes movie with matching id.
     * @param {String} id 
     */
    deleteMovieByID(id){
        return util.dbPromise('DELETE FROM movies WHERE id = ?', [id]);
    },

    /**
     * Finds all movie links for movie.
     * @param {String} movie id of movie
     */
    selectMovieLinksByMovie(movie){
        return util.dbPromise('SELECT * FROM movielinks WHERE movie = ?', [movie]);
    },

    /**
     * Updates movie link values.
     * @param {String} movie 
     * @param {String} platform 
     * @param {String} link 
     * @param {Number} cost 
     */
    updateMovieLink(movie, platform, link, cost){
        return util.dbPromise('UPDATE movielinks SET link = ?, cost = ?, WHERE movie = ? AND platform = ?', [link, cost, movie, platform]);
    },

    /**
     * Inserts movie link into database with given values.
     * @param {String} movie 
     * @param {String} platform 
     * @param {String} link 
     * @param {Number} cost 
     */
    insertMovieLink(movie, platform, link, cost){
        return util.dbPromise('INSERT INTO movielinks(movie, platform, link, cost) VALUES (?, ?, ?, ?)', [movie, platform, link, cost]);
    },

    /**
     * Deletes movie link with matching movie id and platform.
     * @param {String} movie 
     * @param {String} platform 
     */
    deleteMovieLink(movie, platform){
        return util.dbPromise('DELETE FROM movielinks WHERE movie = ? AND platform = ?', [movie, platform]);
    },

    /**
     * Finds all movie tags with associated movie.
     * @param {String} id 
     */
    selectMovieTagsByID(id){
        return util.dbPromise('SELECT * FROM movietags WHERE movie = ?', [id]);
    },

    /**
     * Inserts a movie tag into a movie.
     * @param {String} movie 
     * @param {String} tag 
     */
    insertMovieTag(movie, tag){
        return util.dbPromise('INSERT INTO movietags(movie, tag) VALUES (?, ?)', [movie, tag]);
    },

    /**
     * Deletes movie tag with matching movie id and tag.
     * @param {String} movie 
     * @param {String} tag 
     */
    deleteMovieTag(movie, tag){
        return util.dbPromise('DELETE FROM movietags WHERE movie = ? AND tag = ?', [movie, tag]);
    }

}