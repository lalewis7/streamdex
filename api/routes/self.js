var express = require('express');
const { sha256 } = require('js-sha256');
var router = express.Router();

router.get('/', (req, res) => {
    if (!req.user)
        return res.sendStatus(401);
    res.json({id: req.user.id, username: req.user.handle, email: req.user.email, email_verified: req.user.emmail_ver == 1, admin: req.user.admin == 1});
});

router.post('/', (req, res) => {
    res.sendStatus(403);
});

router.put('/', (req, res) => {
    res.sendStatus(403);
});

router.delete('/', (req, res) => {
    res.sendStatus(403);
});

module.exports = router;