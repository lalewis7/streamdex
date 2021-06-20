var express = require('express');
var router = express.Router();

// models
const userMethods = require('../model_functions/user.js');
const util = require('../util.js');

// get all users (need special priv)
router.get('/', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin)
        return res.sendStatus(403);
    userMethods.getUsers(req.query)
        .then(users => {
            let viewableUsers = [];
            for (let user of users)
                viewableUsers.push(user.get(true));
            res.status(200).send(viewableUsers);
        })
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        })
});

// create user
router.post('/', (req, res) => {
    userMethods.createUser(req.body)
        .then(() => {
            res.sendStatus(201);
        })
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        });
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
router.get('/:userId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
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
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        })
})

// dne
router.post('/:userId', (req, res) => {
    res.sendStatus(405);
})

// edit user
router.put('/:userId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.editUser(req.params.userId, req.user.admin, req.body)
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

// dne
router.delete('/:userId', (req, res) => {
    // requires authentication
    if (!req.user)
        return res.sendStatus(401);
    // requires authorization
    if (!req.user.admin && req.user.user_id != req.params.userId)
        return res.sendStatus(403);
    userMethods.deleteUser(req.params.userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            if (err.stack){
                util.logger().error(err.stack);
                res.sendStatus(500);
            } else
                res.status(400).send(err);
        })
})

module.exports = router;
