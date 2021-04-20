var express = require('express');
var router = express.Router();
var sha256 = require('js-sha256');

var authModel = require('../models/auth.js');

router.get('/', (req, res) => {
    // header values
    var user = req.get('user');
    var pass = req.get('password');

    // check values exist
    if (!user)
        res.status(400).send("Missing user parameter.");
    if (!pass)
        res.status(400).send("Missing password paramter.");

    // get token from auth model
    authModel.getToken(user, sha256(pass))
    // success
    .then(token => {
        res.status(200).send(token);
    })
    // error
    .catch(err => {
        res.status(400).send(err);
    });
});

router.post('/', (req, res) => {
    res.sendStatus(403);
});

router.put('/', (req, res) => {
    res.sendStatus(403);
});

router.delete('/', (req, res) => {
    res.sendStatus(403);
});

module.exports = router;