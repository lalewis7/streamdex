var express = require('express');
var router = express.Router();
var util = require('../util.js');
const {isAdmin, isAuthenticated} = require('../auth.js');

const taskMethods = require('../model_functions/task.js');

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.post('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.delete('/', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

//

router.get('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    taskMethods.getTask(req.params.taskId)
        .then((task) => {
            res.status(200).send(task);
        })
        .catch(util.handleResponseError(res));
});

router.post('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    return res.sendStatus(405);
});

router.put('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    taskMethods.editTask(req.params.taskId, req.body, {admin: req.user.admin})
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

router.delete('/:taskId', isAuthenticated, isAdmin, (req, res) => {
    taskMethods.deleteTask(req.params.taskId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(util.handleResponseError(res));
});

module.exports = router;