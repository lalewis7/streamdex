var express = require('express');
var router = express.Router();
var util = require('../util.js');

const pageMethods = require('../model_functions/page.js');

router.get('/', (req, res) => {
    return res.sendStatus(405);
});

router.post('/', (req, res) => {
    return res.sendStatus(405);
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

router.get('/:pageId', (req, res) => {
    return pageMethods.getPage(req.params.pageId, req.user)
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:pageId', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:pageId', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:pageId', (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;