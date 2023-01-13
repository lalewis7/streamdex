var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const snapshotMethods = require('../model_functions/snapshot.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/', isAuthenticated, isAdmin,  (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.get('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    return snapshotMethods.getSnapshot(req.params.taskId)
        .then(snap => {
            res.status(200).send(snap);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:taskId', isAuthenticated, isAdmin,  (req, res) => {
    return snapshotMethods.editSnapshot(req.params.taskId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    return snapshotMethods.deleteSnapshot(req.params.taskId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

module.exports = router;