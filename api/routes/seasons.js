var express = require('express');
var router = express.Router();
var util = require('../util.js');

const seasonMethods = require('../model_functions/season.js');

// /seasons/:seasonId

router.get('/:seasonId', (req, res) => {
    seasonMethods.getSeason(req.params.seasonId)
        .then(season => {
            res.status(200).send(season);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:seasonId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:seasonId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    seasonMethods.editSeason(req.params.seasonId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:seasonId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    seasonMethods.deleteSeason(req.params.seasonId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// /seasons/:seasonId/availability

router.get('/:seasonId/availability', (req, res) => {
    seasonMethods.getAvailability(req.params.seasonId)
        .then(availability => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:seasonId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:seasonId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:seasonId/availability', (req, res) => {
    return res.sendStatus(405);
});

// /seasons/:seasonId/availability/:platform

router.get('/:seasonId/availability/:platform', (req, res) => {
    seasonMethods.getPlatformAvailability(req.params.seasonId, req.params.platform)
        .then(availability => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:seasonId/availability/:platform', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    seasonMethods.createPlatformAvailability(req.params.seasonId, req.params.platform, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:seasonId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:seasonId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

// /seasons/:seasonId/episodes

router.get('/:seasonId/episodes', (req, res) => {
    seasonMethods.getEpisodes(req.params.seasonId)
        .then(episodes => {
            res.status(200).send(episodes);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:seasonId/episodes', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    seasonMethods.createEpisode(req.params.seasonId, req.body, {admin: req.user.admin})
        .then((id) => {
            res.status(201).send(id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:seasonId/episodes', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:seasonId/episodes', (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;