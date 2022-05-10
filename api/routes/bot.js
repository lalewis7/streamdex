var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const botMethods = require('../model_functions/bot.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    titleMethods.getTitles(req.query)
        .then(titles => {
            res.status(200).send(titles);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    titleMethods.createTitle(req.body, {admin: req.user.admin})
        .then((id) => {
            res.status(201).send(id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

//

router.get('/:botId', (req, res) => {
    titleMethods.getTitle(req.params.titleId)
        .then((title) => {
            res.status(200).send(title);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:botId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:botId', isAuthenticated, isAdmin, (req, res) => {
    titleMethods.editTitle(req.params.titleId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:botId', isAuthenticated, isAdmin, (req, res) => {
    titleMethods.deleteTitle(req.params.titleId, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

//

router.get('/:botId/tasks', (req, res) => {
    titleMethods.getLinks(req.params.titleId)
        .then((links) => {
            res.status(200).send(links);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:botId/tasks', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:botId/tasks', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:botId/tasks', (req, res) => {
    return res.sendStatus(405);
});