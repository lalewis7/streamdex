var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var util = require('../util.js');

var movieModel = require('../models/movie.js');

router.get('/:id', (req, res) => {
    var id = req.params.id;
    console.log(JSON.stringify(req.params));
    movieModel.getMovie(id).then(movie => {
        res.send(movie);
    })
    .catch(err => {
        res.sendStatus(500);
        console.log(err);
    })
});

router.post('/:id/links', (req, res) => {
    var id = req.params.id;
    if (id[0] !== 'm' && id[0] !== 's')
        return res.status(400).send("Invalid ID.");
    // movie
    if (id[0] === 'm'){
        if (!req.body.platform)
            return res.status(400).send("Missing platform parameter.");
        if (!req.body.link)
            return res.status(400).send("Missing link parameter.");
        if (!req.body.cost)
            return res.status(400).send("Missing cost parameter.");
        var platform = req.body.platform;
        var link = req.body.link;
        // make sure movie exists
        findMovie(id)
        .then(movies => {
            if (movies.length === 0)
                return res.status(400).send("Title does not exist.");
            deleteMovieStreamLink(id, platform)
            .then(() => {
                return addMovieStreamLink(id, platform, link, cost);
            })
            .then(() => {
                res.sendStatus(201);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    }
    // tv show
    else {

    }
});

router.post('/', (req, res) => {
    // require admin priv
    if (!req.user || req.user.admin !== 1)
        return res.sendStatus(401);
    // require movie or show type
    if (!req.body.type)
        return res.status(400).send("Missing type parameter.");
    var type = req.body.type;
    // check that type is either movie or show
    if (type !== "movie" && type !== "show")
        return res.status(422).send("Type invalid.");
    // movie
    if (type === "movie"){
        movieModel.createMovie(data, user.admin)
        // send success code to client
        .then(() => {
            res.sendStatus(201);
        })
        // catch internal error
        .catch(err => {
            console.log(err);
            return res.sendStatus(500);
        });
    }
    // tv show
    else {

    }
});

function getShow(id){
    return new Promise((res, rej) => {
        db.query({sql: 'SELECT * FROM shows where id = ?', values: [id]}, (err, rows) => {
            if (err) rej(err);
            res(rows);
        });
    });
}

function addMovieStreamLink(id, platform, link, cost){
    return new Promise((res, rej) => {
        db.query({sql: 'INSERT INTO movielinks (id, platform, link, cost) VALUES (?, ?, ?)', values: [id, platform, link, cost]}, (err, rows) => {
            if (err) rej(err);
            res(rows);
        })
    })
}

function deleteMovieStreamLink(id, platform) {
    return new Promise((res, rej) => {
        db.query({sql: 'DELETE FROM movielinks WHERE id = ? AND platform = ?', values: [id, platform]}, (err, rows) => {
            if (err) rej(err);
            res(rows);
        })
    })
}

module.exports = router;