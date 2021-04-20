var mysql = require('mysql');
var config = require('./config.js');

var pool  = mysql.createPool(config.db);

module.exports = pool;