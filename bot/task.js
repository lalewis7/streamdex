const puppeteer = require('puppeteer');

const rt_snapshot = require('./snapshots/rt.snapshot.js');
const rt_crawler = require('./crawlers/rt.crawler.js');

const API = require('./api.js');

class Task {

    constructor(id, link, type, started, ended, status){
        this.id = id;
        this.link = link;
        this.type = type;
        this.script = getScript(type);
        this.started = started;
        this.ended = ended;
        this.status = status;
        this.api = new API();
    }

    async execute(){
        await this.init();
        await this.prepare();
        await this.execute();
        await this.close();
    }

    async init(){
        console.log("Initializing task  ["+this.id+"]...");
        this.browser = await puppeteer.launch({headless: true, defaultViewport: {width: 1920, height: 1080}});
        this.page = await this.browser.newPage();
        await this.api.auth();
    }

    async prepare(){
        console.log("Preparing task ["+this.id+"]...");
        await this.page.goto(this.link);
    }

    async execute(){
        console.log("Executing task ["+this.id+"]...");
        await this.script(this.id, this.page, this.api);
    }

    async close(){
        console.log("Closing task ["+this.id+"]...");
        await this.page.close();
        await this.browser.close();
    }

}

function getScript(type){
    switch (type){
        case "rt.snapshot.js":
            return rt_snapshot;
        case "rt.crawler.js":
            return rt_crawler;
    }
}

let execPromise;

async function stop(callback){
    await execPromise;
    callback();
}

function terminator(sig) {
    if (typeof sig === "string") {
        // call your async task here and then call process.exit() after async task is done
        stop(function() {
            console.log('Received %s - terminating server app ...', sig);
            process.exit(1);
        });
    }
    console.log('Node server stopped.');
}

let args = process.argv.slice(2);

// not enough arguments
if (args.length < 6){
    console.log("Error: not enough arguments\nid, link, type (script), started, ended, status");
    process.exitCode = 1;
}
// 6 or more arguments
else {
    let task = new Task(args[0], args[1], args[2], args[3], args[4], args[5]);
    execPromise = new Promise((resolve, reject) => resolve(task.execute()));
    
    ['beforeExit'].forEach(function (sig) {
        process.on(sig, function () {
            terminator(sig);
            console.log('signal: ' + sig);
        });
    });

}