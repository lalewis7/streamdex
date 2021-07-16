var express = require('express');
var router = express.Router();
var sha256 = require('js-sha256');

var Token = require('../models/token.js');
var util = require('../util.js');

router.get('/', (req, res) => {
    // header values
    var user = req.get('user');
    var pass = req.get('password');

    // check values exist
    if (!user)
        return res.status(400).send("Missing user parameter.");
    if (!pass)
        return res.status(400).send("Missing password paramter.");

    // get token from auth model
    Token.getToken(user, sha256(pass))
    // success
    .then(token => {
        res.status(200).send(token);
    })
    // error
    .catch(util.handleResponseError(res));
});

router.post('/', (req, res) => {
    return res.sendStatus(405);
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;