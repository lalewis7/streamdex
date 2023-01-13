const Bot = require('./bot.js');
const IMDBCrawlerController = require('./controllers/imdb.crawler.controller.js');
const BotManager = require('./bot_manager.js');

let bot_manager = new BotManager();

async function start(){
    //await api.auth();
    await bot_manager.start();
    //bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/m/moana_2016', type: 'rt.snapshot.js', started: null, ended: null, status: 'pending'});
    // bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/tv/black_mirror', type: 'rt.snapshot.js', started: null, ended: null, status: 'pending'});
    // bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/m/white_noise_2022', type: 'rt.snapshot.js', started: null, ended: null, status: 'pending'});
    // bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/m/broker', type: 'rt.snapshot.js', started: null, ended: null, status: 'pending'});
    //bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/tv/the_walking_dead', type: 'rt.snapshot.js', started: null, ended: null, status: 'pending'});

    //bot_manager.queued_tasks.push({task_id: 'sampleID', link: 'https://www.rottentomatoes.com/search?search=walking%20dead', type: 'rt.crawler.js', started: null, ended: null, status: 'pending'});
}

async function stop(callback){
    bot_manager.stop();
    await bot_manager.runningPromise;
    console.log('active tasks: ' + bot_manager.active_tasks.length);
    while (bot_manager.active_tasks.length > 0)
        await new Promise(r => setTimeout(r, 1000));
    console.log('active tasks: ' + bot_manager.active_tasks.length);
    callback();
}

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (sig) {
    process.on(sig, function () {
        terminator(sig);
        console.log('signal: ' + sig);
    });
});

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

start();

// let botController = new IMDBCrawlerController();
// let bot = new Bot({headless: false, defaultViewport: {width: 1920, height: 1080}});

// botController.start(bot);