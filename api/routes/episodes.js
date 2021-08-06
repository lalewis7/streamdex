var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const episodeMethods = require('../model_functions/episode.js');

// /episodes/:episodeId

router.get('/:episodeId', (req, res) => {
    episodeMethods.getEpisode(req.params.episodeId)
        .then(episode => {
            res.status(200).send(episode);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:episodeId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:episodeId', isAuthenticated, isAdmin, (req, res) => {
    episodeMethods.editEpisode(req.params.episodeId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:episodeId', isAuthenticated, isAdmin, (req, res) => {
    episodeMethods.deleteEpisode(req.params.episodeId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// /episodes/:episodeId/availability

router.get('/:episodeId/availability', (req, res) => {
    episodeMethods.getAvailability(req.params.episodeId)
        .then(availability => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:episodeId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:episodeId/availability', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:episodeId/availability', (req, res) => {
    return res.sendStatus(405);
});

// /episodes/:episodeId/availability/:platform

router.get('/:episodeId/availability/:platform', (req, res) => {
    episodeMethods.getPlatformAvailability(req.params.episodeId, req.params.platform)
        .then(availability => {
            res.status(200).send(availability);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:episodeId/availability/:platform', isAuthenticated, isAdmin, (req, res) => {
    episodeMethods.createPlatformAvailability(req.params.episodeId, req.params.platform, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:episodeId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:episodeId/availability/:platform', (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;