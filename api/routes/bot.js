var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const botMethods = require('../model_functions/bot.js');
const taskMethods = require('../model_functions/task.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    botMethods.getBots(req.query)
        .then(bots => {
            res.status(200).send(bots);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    botMethods.createBot(req.body, {admin: req.user.admin})
        .then((id) => {
            res.status(201).send(id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/', isAuthenticated, isAdmin,  (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

//

router.get('/:botId', isAuthenticated, isAdmin, (req, res) => {
    botMethods.getBot(req.params.botId)
        .then((bot) => {
            res.status(200).send(bot);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:botId', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:botId', isAuthenticated, isAdmin, (req, res) => {
    botMethods.editBot(req.params.botId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:botId', isAuthenticated, isAdmin, (req, res) => {
    botMethods.deleteBot(req.params.botId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

//

router.get('/:botId/tasks', isAuthenticated, isAdmin, (req, res) => {
    taskMethods.getBotTasks(req.params.botId)
        .then((tasks) => {
            res.status(200).send(tasks);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:botId/tasks', isAuthenticated, isAdmin, (req, res) => {
    taskMethods.createTask(req.params.botId, req.body, {admin: req.user.admin})
        .then(id => {
            res.status(201).send(id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:botId/tasks', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:botId/tasks', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;