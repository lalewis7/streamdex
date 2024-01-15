var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
    "connectionLimit": config.db.connectionLimit,
    "host": process.env.STREAMDEX_DB_HOST || config.db.host,
    "user": process.env.STREAMDEX_DB_USER || config.db.user,
    "password": process.env.STREAMDEX_DB_PASSWORD || config.db.password,
    "database": process.env.STREAMDEX_DB_DATABASE || config.db.database
});

module.exports = pool;