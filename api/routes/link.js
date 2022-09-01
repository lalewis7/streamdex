var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const linkMethods = require('../model_functions/botlinks.js');
const snapMethods = require('../model_functions/snapshot.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    linkMethods.getLinks(req.query)
        .then(links => {
            res.status(200).send(links);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    linkMethods.createLink(req.body, {admin: req.user.admin})
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

router.get('/:linkId', isAuthenticated, isAdmin, (req, res) => {
    linkMethods.getLink(req.params.linkId)
        .then((link) => {
            res.status(200).send(link);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:linkId', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:linkId', isAuthenticated, isAdmin, (req, res) => {
    linkMethods.editLink(req.params.linkId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:linkId', isAuthenticated, isAdmin, (req, res) => {
    linkMethods.deleteLink(req.params.linkId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

//

router.get('/:linkId/snapshots', isAuthenticated, isAdmin, (req, res) => {
    snapMethods.getLinkSnapshots(req.params.linkId)
        .then((snaps) => {
            res.status(200).send(snaps);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:linkId/snapshots', isAuthenticated, isAdmin, (req, res) => {
    snapMethods.createSnapshot(req.params.linkId, req.body, {admin: req.user.admin})
        .then(id => {
            res.status(201).send(""+id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:linkId/snapshots', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:linkId/snapshots', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

//

router.get('/:linkId/latest-snapshot', isAuthenticated, isAdmin, (req, res) => {
    snapMethods.getLatestSnapshot(req.params.linkId)
        .then((snap) => {
            res.status(200).send(snap);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:linkId/latest-snapshot', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:linkId/latest-snapshot', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:linkId/latest-snapshot', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;