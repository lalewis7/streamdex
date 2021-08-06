var express = require('express');
var router = express.Router();
const {isAdmin, isAuthenticated} = require('../auth.js');

// models
const userMethods = require('../model_functions/user.js');
const util = require('../util.js');

// get all users (need special priv)
router.get('/', isAuthenticated, isAdmin, (req, res) => {
    userMethods.getUsers(req.query)
        .then(users => {
            let viewableUsers = [];
            for (let user of users)
                viewableUsers.push(user.get(true));
            res.status(200).send(viewableUsers);
        })
        .catch(util.handleResponseError(res));
});

// create user
router.post('/', (req, res) => {
    userMethods.createUser(req.body)
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

// dne
router.put('/', (req, res) => {
    res.sendStatus(405);
})

// dne
router.delete('', (req, res) => {
    res.sendStatus(405);
})

// get user
router.get('/:userId', isAuthenticated, (req, res) => {
    var id = req.params.userId;
    // passing self as user id gives your own information
    if (id.toLowerCase() === "self")
        id = req.user.user_id;
    // requires authorization
    if (!req.user.admin && req.user.user_id != id)
        return res.sendStatus(403);
    userMethods.getUserByID(id)
        .then(user => {
            res.status(200).send(user.get(true));
        })
        .catch(util.handleResponseError(res));
})

// dne
router.post('/:userId', (req, res) => {
    res.sendStatus(405);
})

// edit user
router.put('/:userId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.editUser(req.params.userId, req.user.admin, req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

// dne
router.delete('/:userId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.deleteUser(req.params.userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
})

router.get('/:userId/ratings/:titleId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.getRating(req.params.userId, req.params.titleId)
        .then((rating) => {
            res.status(200).send(rating);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:userId/ratings/:titleId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.insertRating(req.params.userId, req.params.titleId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(201);
        })
        .catch(util.handleResponseError(res));
});

router.put('/:userId/ratings/:titleId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.editRating(req.params.userId, req.params.titleId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:userId/ratings/:titleId', isAuthenticated, (req, res) => {
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.deleteRating(req.params.userId, req.params.titleId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

module.exports = router;
