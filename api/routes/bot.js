var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const botMethods = require('../model_functions/bot.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    botMethods.getBotConfiguration()
        .then(config => {
            res.status(200).send(config);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/', isAuthenticated, isAdmin,  (req, res) => {
    botMethods.editBotConfiguration(data, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;