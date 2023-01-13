// controllers
const titleController = require('../controllers/title.js');
const movieController = require('../controllers/movie.js');
const linksController = require('../controllers/links.js');
const movieLinksController = require('../controllers/movie.links.js');
const seasonController = require('../controllers/season.js');

// models
const Show = require('../models/show.js');
const Movie = require('../models/movie.js');
const Title = require('../models/title.js');
const Season = require('../models/season.js');
const {Link, MovieLink, Availability, getAvailables} = require('../models/links.js');

// helpers
const {titleExists, isTitleMovie, titleIsMovie, titleIsShow, dataMissingParameter, editModel} = require('./common.js');

function createTitle(data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["type", "title"]))
        return Promise.reject("Missing " + param + " parameter.");

    // title is show
    if (data.type === "show"){
        delete data.type;
        let s = new Show();
        return editModel(s, data, requester)
            .then(() => {
                return s.insert();
            })
            .then(() => {
                return s.get().id
            });
    }

    // movie
    else if (data.type === "movie"){
        delete data.type;
        let m = new Movie();
        return editModel(m, data, requester)
            .then(() => {
                return m.insert();
            })
            .then(() => {
                return m.get().id
            });
    }
    else {
        return Promise.reject("Invalid Type. Must be show or movie.");
    }
}

function editTitle(id, data, requester){
    let titles;
    return titleExists(id)
        .then(res => {
            titles = res;
            return isTitleMovie(id);
        })
        .then(isMovie => {
            // movie
            if (isMovie){
                let movie;
                return movieController.selectMoviesByID(id)
                    .then(movies => {
                        movie = new Movie({...titles[0], ...movies[0]});
                        return movie.init()
                    })
                    .then(() => {
                        return editModel(movie, data, requester);
                    })
                    .then(() => {
                        return movie.save();
                    });
            } 
            // show
            else {
                let show = new Show(titles[0]);
                return show.init()
                    .then(() => {
                        return editModel(show, data, requester);
                    })
                    .then(() => {
                        return show.save();
                    })
            }
        })
}

function getTitle(id) {
    let titles;
    // search for user
    return titleExists(id)
        .then(res => {
            titles = res;
            return isTitleMovie(id);
        })
        .then((isMovie) => {
            // movie
            if (isMovie){
                let movie;
                return movieController.selectMoviesByID(id)
                    .then(movies => {
                        movie = new Movie({...titles[0], ...movies[0]});
                        return movie.init();
                    })
                    .then(() => {
                        return movie.get(true);
                    });
            }
            // show
            else {
                let show = new Show(titles[0]);
                return show.init()
                    .then(() => {
                        return show.get(true);
                    });
            }
        })
}

function deleteTitle(id) {
    let titles;
    // search for user
    return titleExists(id)
        .then(res => {
            titles = res;
            return isTitleMovie(id);
        })
        .then((isMovie) => {
            // movie
            if (isMovie){
                let movie = new Movie(titles[0]);
                return movie.init().then(() => {
                    return movie.delete();
                });
            }
            // show
            else {
                let show = new Show(titles[0]);
                return show.init().then(() => {
                    return show.delete();
                });
            }
        })
}

function getTitles(query){
    var page = query.p === undefined ? 0 : query.p;
    var controller;
    let titles = [];
    if (query.q === undefined || query.q === '')
        controller = titleController.findAllTitles(page);
    else 
        controller = titleController.searchAllTitles(query.q, page);
    return controller.then(ts => {
        // convert to class
        var initPromises = [];
        for (let titleData of ts){
            let title = new Title([], titleData);
            initPromises.push(title.init());
            titles.push(title);
        }
        return Promise.all(initPromises);
    }).then(() => {
        let viewable = [];
        titles.map((title) => {
            viewable.push(title.get(true));
        })
        return viewable;
    })
}

function getLinks(id){
    return titleExists(id)
        .then(() => {
            return linksController.getLinks(id);
        })
        .then(links => {
            return links.map(li => new Link(li).get(true));
        })
}

function createLink(id, platform, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["link"]))
        return Promise.reject("Missing " + param + " parameter.");

    return titleExists(id)
        .then(() => {
            return linksController.getLink(id, platform)
        })
        .then(res => {
            // link exists
            if (res.length > 0)
                return Promise.reject({http_msg: "Link already exists.", http_code: 400});
            return res;
        })
        .then(() => {
            let link = new Link({title_id: id, platform: platform});
            return editModel(link, data, requester);
        })
        .then(link => {
            return link.insert();
        })
}

function getLink(id, platform){
    return linksController.getLink(id, platform)
        .then(res => {
            // link dne
            if (res.length == 0)
                return Promise.reject("Link does not exist.");
            let link = new Link(res[0]);
            return link.get(true);
        })
}

function editLink(id, platform, data, requester){
    return linksController.getLink(id, platform)
        .then(res => {
            // link dne
            if (res.length == 0)
                return Promise.reject("Link does not exist.");
            let link = new Link(res[0]);
            return editModel(link, data, requester);
        })
        .then(link => {
            return link.save();
        })
}

function deleteLink(id, platform){
    return linksController.getLink(id, platform)
        .then(res => {
            // link dne
            if (res.length == 0)
                return Promise.reject("Link does not exist.");
            let link = new Link(res[0]);
            return link.delete();
        })
}

function getAvailability(id){
    // check title exists
    return titleExists(id)
        .then(() => {
            // check title is movie
            return titleIsMovie(id);
        })
        .then(() => {
            return movieLinksController.getMovieLinks(id);
        })
        .then(links => {
            return getAvailables(links.map(li => new MovieLink(li))).map(available => available.get(true));
        });
}

function getPlatformAvailability(id, platform){
    // check title exists
    return titleExists(id)
        .then(() => {
            // check title is movie
            return titleIsMovie(id);
        })
        .then(() => {
            return movieLinksController.getMoviePlatformLinks(id, platform);
        })
        .then(links => {
            let available = new Availability({platform: platform});
            available.init(links.map(li => new MovieLink(li)));
            return available.get();
        })
}

function createAvailability(id, platform, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["country", "available"]))
        return Promise.reject("Missing " + param + " parameter.");

    // check title exists
    return titleExists(id)
        .then(() => {
            // check title is movie
            return titleIsMovie(id);
        })
        .then(() => {
            let link = new MovieLink({title_id: id, platform: platform});
            return editModel(link, data, requester);
        })
        .then(link => {
            return link.insert();
        })
}

function getSeasons(id){
    let seasons = [];
    return titleExists(id)
        .then(() => {
            // check title is movie
            return titleIsShow(id);
        })
        .then(() => {
            return seasonController.getAllSeasons(id);
        })
        .then(seasonsData => {
            seasons = seasonsData.map(season => new Season(season));
            let promises = [];
            seasons.map(season => promises.push(season.init()));
            return Promise.all(promises);
        })
        .then(() => {
            return seasons.map(season => season.get(true));
        })
}

function createSeason(id, data, requester){

    // ensure all parameters exist
    let param;
    if (param = dataMissingParameter(data, ["season_number"]))
        return Promise.reject("Missing " + param + " parameter.");

    // check title exists
    let season;
    return titleExists(id)
        .then(() => {
            // check title is movie
            return titleIsShow(id);
        })
        .then(() => {
            season = new Season({title_id: id});
            return editModel(season, data, requester);
        })
        .then(season => {
            return season.insert();
        })
        .then(() => {
            return season.get().id;
        })
}

module.exports = {
    createTitle,
    editTitle,
    getTitle,
    deleteTitle,
    getTitles,
    getLinks,
    createLink,
    getLink,
    editLink,
    deleteLink,
    getAvailability,
    getPlatformAvailability,
    createAvailability,
    getSeasons,
    createSeason
}