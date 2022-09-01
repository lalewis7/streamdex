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
    return fetch(config.API+"/auth", {
            "headers": {
                "username": config.API_USERNAME,
                "password": config.API_PASSWORD
            }  
        })
        .then(response => response.text())
        .then(token => {
            apiToken = token;
        });
}

// get bot details
function getBotDetails(){
    return fetch(config.API + "/bots", {
            "token": apiToken    
        })
        .then(response => response.json())
        .then(botsJSON => {
            
        })
}

let botController = new IMDBCrawlerController();
let bot = new Bot({headless: true, defaultViewport: {width: 1920, height: 1080}});

botController.start(bot);