// controllers
const titleController = require('../controllers/title.js');
const movieController = require('../controllers/movie.js');

// models
const Show = require('../models/show.js');
const Movie = require('../models/movie.js');
const Title = require('../models/title.js');

function createTitle(data, requester){
    let params = ["type", "title"];
    // ensure all parameters exist
    for (let param of params)
        if (!data[param])
            return Promise.reject("Missing " + param + " parameter.");
    if (data.type === "show"){
        delete data.type;
        let s = new Show();
        let invalid = s.validate(data, requester);
        if (invalid.length > 0)
            return Promise.reject(invalid[0] + " parameter invalid.");
        s.edit(data, requester);
        return s.insert().then(() => {return s.get().id});
    }
    else if (data.type === "movie"){
        delete data.type;
        let m = new Movie();
        let invalid = m.validate(data, requester);
        if (invalid.length > 0)
            return Promise.reject(invalid[0] + " parameter invalid.");
        m.edit(data, requester);
        return m.insert().then(() => {return m.get().id});
    }
    else {
        return Promise.reject("Invalid Type. Must be show or movie.");
    }
}

function editTitle(id, data, requester){
    let titles;
    return titleController.getTitlesByID(id)
        .then(res => {
            if (res.length == 0)
                return Promise.reject("Title not found.");
            titles = res;
            return movieController.selectMoviesByID(id);
        })
        .then(movies => {
            if (movies.length == 0){
                let show = new Show(titles[0]);
                return show.init().then(() => {
                    show.edit(data, requester);
                    return show.save();
                })
            } else {
                let movie = new Movie(titles[0]);
                return movie.init().then(() => {
                    movie.edit(data, requester);
                    return movie.save();
                })
            }
        })
}

function getTitle(id) {
    let titles;
    // search for user
    return titleController.getTitlesByID(id)
        .then(res => {
            // user does not exist
            if (res.length == 0)
                return Promise.reject("Title does not exist.");
            titles = res;
            return movieController.selectMoviesByID(id);
        })
        .then((movies) => {
            if (movies.length == 0){
                let show = new Show(titles[0]);
                return show.init().then(() => {
                    return show.get(true);
                });
            }else {
                let movie = new Movie(titles[0]);
                return movie.init().then(() => {
                    return movie.get(true);
                })
            }
        })
}

function deleteTitle(id) {
    let titles;
    // search for user
    return titleController.getTitlesByID(id)
        .then(res => {
            // user does not exist
            if (res.length == 0)
                return Promise.reject("Title does not exist.");
            titles = res;
            return movieController.selectMoviesByID(id);
        })
        .then((movies) => {
            if (movies.length == 0){
                let show = new Show(titles[0]);
                return show.init().then(() => {
                    return show.delete();
                });
            }else {
                let movie = new Movie(titles[0]);
                return movie.init().then(() => {
                    return movie.delete();
                })
            }
        })
}

function getTitles(query){
    var page = query.p === undefined ? 0 : query.p;
    var controller;
    let titles = [];
    if (query.q === undefined)
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

module.exports = {
    createTitle,
    editTitle,
    getTitle,
    deleteTitle,
    getTitles
}