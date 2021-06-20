var express = require('express');
var router = express.Router();
var util = require('../util.js');

const titleMethods = require('../model_functions/title.js');

router.get('/', (req, res) => {
    titleMethods.getTitles(req.query)
        .then(titles => {
            res.status(200).send(titles);
        })
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        })
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
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        });
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

router.get('/:titleId', (req, res) => {
    titleMethods.getTitle(req.params.titleId)
        .then((title) => {
            res.status(200).send(title);
        })
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        });
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
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        });
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
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        });
});

// TODO: include individual route for seasons and link / episodes

module.exports = router;