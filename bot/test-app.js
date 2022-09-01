const Bot = require('./bot.js');
const IMDBCrawlerController = require('./controllers/imdb.crawler.controller.js');
const fetch = require('node-fetch');
const config = require('./config.json');

let apiToken;
let browser;
let controller;

async function start(){
    await authenticate();
    await getBotDetails();
}

// authenticate bot
function authenticate(){
    return fetch(config.API+"/auth")
        .then(response => response.text())
        .then(token => {
            apiToken = token;
        });
}

// get bot details
function getBotDetails(){

}

let botController = new IMDBCrawlerController();
let bot = new Bot({headless: true, defaultViewport: {width: 1920, height: 1080}});

botController.start(bot);