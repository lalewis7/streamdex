var express = require('express');
var router = express.Router();
var util = require('../util.js');

const titleMethods = require('../model_functions/title.js');

// /titles

router.get('/', (req, res) => {
    titleMethods.getTitles(req.query)
        .then(titles => {
            res.status(200).send(titles);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
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

// /titles/:titleId

router.get('/:titleId', (req, res) => {
    titleMethods.getTitle(req.params.titleId)
        .then((title) => {
            res.status(200).send(title);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:titleId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.editTitle(req.params.titleId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:titleId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.deleteTitle(req.params.titleId, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// /titles/:titleId/links

router.get('/:titleId/links', (req, res) => {
    titleMethods.getLinks(req.params.titleId)
        .then((links) => {
            res.status(200).send(links);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId/links', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:titleId/links', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:titleId/links', (req, res) => {
    return res.sendStatus(405);
});

// /titles/:titleId/links/:platform

router.get('/:titleId/links/:platform', (req, res) => {
    titleMethods.getLink(req.params.titleId, req.params.platform)
        .then((link) => {
            res.status(200).send(link);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId/links/:platform', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.createLink(req.params.titleId, req.params.platform, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:titleId/links/:platform', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.editLink(req.params.titleId, req.params.platform, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:titleId/links/:platform', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.deleteLink(req.params.titleId, req.params.platform)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// /titles/:titleId/availability

router.get('/:titleId/availability', (req, res) => {
    titleMethods.getAvailability(req.params.titleId)
        .then((availability) => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:titleId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:titleId/availability', (req, res) => {
    return res.sendStatus(405);
});

// /titles/:titleId/availability:platform

router.get('/:titleId/availability/:platform', (req, res) => {
    titleMethods.getPlatformAvailability(req.params.titleId, req.params.platform)
        .then((availability) => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId/availability/:platform', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.createAvailability(req.params.titleId, req.params.platform, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:titleId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:titleId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

// /titles/:titleId/seasons

router.get('/:titleId/seasons', (req, res) => {
    titleMethods.getSeasons(req.params.titleId)
        .then((seasons) => {
            res.status(200).send(seasons);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:titleId/seasons', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    titleMethods.createSeason(req.params.titleId, req.body, {admin: req.user.admin})
        .then((id) => {
            res.status(201).send(id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:titleId/seasons', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:titleId/seasons', (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;