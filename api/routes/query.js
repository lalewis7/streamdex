var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const queryMethods = require('../model_functions/query.js');
const searchMethods = require('../model_functions/search.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    queryMethods.getQueries(req.query)
        .then(queries => {
            res.status(200).send(queries);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    queryMethods.createQuery(req.body, {admin: req.user.admin})
        .then((query) => {
            res.status(201).send(query);
        })
        .catch(util.handleResponseError(res));
});

router.put('/', isAuthenticated, isAdmin,  (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.get('/:query', isAuthenticated, isAdmin, (req, res) => {
    queryMethods.getQuery(req.params.query)
        .then(query => {
            res.status(200).send(query);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:query', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:query', isAuthenticated, isAdmin,  (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:query', isAuthenticated, isAdmin, (req, res) => {
    queryMethods.deleteQuery(req.params.query)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.get('/:query/searches', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.post('/:query/searches', isAuthenticated, isAdmin, (req, res) => {
    searchMethods.createSearch(req.params.query, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:query/searches', isAuthenticated, isAdmin,  (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:query/searches', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.get('/:query/searches/:site', isAuthenticated, isAdmin, (req, res) => {
    searchMethods.getSearch(req.params.query, req.params.site)
        .then((search) => {
            res.status(200).send(search);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:query/searches/:site', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:query/searches/:site', isAuthenticated, isAdmin,  (req, res) => {
    searchMethods.updateSearch(req.params.query, req.params.site, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:query/searches/:site', isAuthenticated, isAdmin, (req, res) => {
    searchMethods.deleteSearch(req.params.query, req.params.site)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

module.exports = router;