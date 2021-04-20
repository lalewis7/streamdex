var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/:handle', (req, res) => {
    usersWithHandle(req.params.handle).then(rows => {
        if (rows.length == 0)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    })
});

function usersWithHandle(handle){
    return new Promise((res, rej) => {
        db.query({sql: 'SELECT * FROM users where handle = ?', values: [handle]}, (err, rows) => {
            if (err) rej(err);
            res(rows);
        });
    });
}

module.exports = router;