const mysql = require('mysql');
const config = require('./config.json');
const winston = require('winston');
require('winston-daily-rotate-file');

const pool  = mysql.createPool(config.db);

var fileTransport = new winston.transports.DailyRotateFile({
    filename: './logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'verbose'
});

const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.splat(),
        winston.format.simple(),
        loggerFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({ level: 'silly' }),
        fileTransport
    ],
});

module.exports = {
    /**
     * Calls a query to the database returning a promise that resolves the rows or rejects any errors.
     * @param {String} sql sql query
     * @param {Array} values values in query with placeholder '?'
     */
    dbPromise(sql, ...values){
        return new Promise((res, rej) => {
            pool.query({sql: sql, values: values}, (err, rows) => {
                if (err) rej(err);
                res(rows);
            })
        })
    },

    /**
     * Returns instance of winston.js logger.
     */
    logger(){
        return logger;
    },

    handleResponseError(res){
        return err => {
            if (err.stack){
                logger.error(err.stack);
                res.sendStatus(500);
            } else
                res.status(err.http_code ? err.http_code : 400).send(err.http_msg ? err.http_msg : err);
        }
    }
}