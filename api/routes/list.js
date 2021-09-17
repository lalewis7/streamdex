var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const listMethods = require('../model_functions/list.js');

router.get('/', (req, res) => {
    return res.sendStatus(405);
});

router.post('/', isAuthenticated, isAdmin,  (req, res) => {
    listMethods.createList(req.body, {admin: req.user.admin})
        .then((list_id) => {
            return res.status(201).send(list_id);
        })
        .catch(util.handleResponseError(res));
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

router.get('/:listId', (req, res) => {
    listMethods.getList(req.params.listId)
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:listId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:listId', isAuthenticated, isAdmin, (req, res) => {
    listMethods.editList(req.params.listId, req.body, {admin: req.user.admin})
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:listId', isAuthenticated, isAdmin,  (req, res) => {
    listMethods.deleteList(req.params.listId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

module.exports = router;