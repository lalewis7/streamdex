var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const imageMethods = require('../model_functions/image.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    imageMethods.getImages(req.query)
        .then((resp) => {
            return res.status(200).send(resp);
        })
        .catch(util.handleResponseError(res));
});

router.post('/', isAuthenticated, isAdmin, imageMethods.preUpload, imageMethods.upload, (req, res) => {
    imageMethods.postUpload(req)
        .then((response) => {
            return res.status(201).send(response);
        })
        .catch(util.handleResponseError(res));
});

router.put('/', (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', (req, res) => {
    return res.sendStatus(405);
});

router.get('/:image', (req, res) => {
    imageMethods.getImage(req.params.image, {admin: req.user ? req.user.admin : false})
        .then((path) => {
            return res.sendFile(path);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:image', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:image', isAuthenticated, isAdmin, (req, res) => {
    imageMethods.editImage(req.params.image, req.body, {admin: req.user.admin})
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:image', isAuthenticated, isAdmin, (req, res) => {
    imageMethods.deleteImage(req.params.image)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// details

router.get('/:image/info', isAuthenticated, isAdmin, (req, res) => {
    imageMethods.getImageDetails(req.params.image)
        .then((resp) => {
            return res.status(200).send(resp);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:image/info', (req, res) => {
    return res.sendStatus(405);
});

router.put('/:image/info', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.delete('/:image/info', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

module.exports = router;