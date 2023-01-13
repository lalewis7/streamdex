const {fork} = require("child_process");
const API = require('./api.js');

// is given tasks which are 
class BotManager {

    constructor(){
        this.active_tasks = [];
        this.queued_tasks = [];
        this.running = false;
        this.runningPromise;
        this.config = {
            threads: 2
        }
        this.api = new API();
    }

    async start(){
        if (this.running)
            return;
        await this.api.auth();
        this.running = true;
        this.runningPromise = new Promise((resolve, reject) => resolve(this.run()));
    }
    
    stop(){
        this.running = false;
    }
    
    isRunning(){
        return this.running;
    }
    
    async run(){
        mainLoop: while (this.running){
            // sleep for 3 second
            await new Promise(r => setTimeout(r, 3000));
            // if no more tasks are queued
            if (this.queued_tasks.length === 0 && this.active_tasks < this.config.threads){
                // attempt to load more in
                console.log('No more queued tasks available. Checking for more pending tasks...');
                let tasks = await this.api.req('/tasks?status=pending', 'GET', null, true).catch(err => {
                    console.log(err + " Error when getting tasks.");
                    return null;
                });
                if (!tasks)
                    continue mainLoop;
                // if no more exist then check if some can be added
                if (tasks.length === 0){
                    await Promise.all(['rt'].map(async site => {
                        // check queries for missing sites
                        console.log('No pending tasks. Checking for unsearched queries on '+site+'...');
                        let queries = await this.api.req('/queries?site='+site, 'GET', '', true).catch(err => {
                            console.log(err + " Error when getting queries.");
                            return null;
                        });
                        // api request failed
                        if (!queries)
                            return;
                        // make a task for every query and add it to the query
                        await Promise.all(queries.map(async query => {
                            // create bot link
                            console.log('Creating link for ' + site + " search page for \'" + query.query + "\'...");
                            let link_id = await this.api.req('/links', 'POST', {
                                link: 'https://www.rottentomatoes.com/search?search='+encodeURIComponent(query.query)
                            }, false).catch(err => {
                                console.log(err + " Error when creating link.");
                                return null;
                            });
                            // api request failed
                            if (!link_id)
                                return;
                            // create task
                            console.log('Creating task to crawl the link...');
                            let task_id = await this.api.req('/tasks', 'POST', {
                                link_id: link_id,
                                type: 'rt.crawler.js', 
                                started: null, 
                                ended: null, 
                                status: 'pending'
                            }, false).catch(err => {
                                console.log(err + " Error when creating task.");
                                return null;
                            });
                            // api request failed
                            if (!task_id)
                                return;
                            // update query
                            console.log('Updating query with task_id: '+task_id+'...');
                            await this.api.req('/queries/'+query.query+'/searches', 'POST', {
                                site: site,
                                task_id: task_id
                            }, false)
                            // api request failed try to delete task because link has not been updated yet.
                            .catch(err => {
                                console.log(err + " Error when updating link. Deleting task...");
                                return this.api.req('/tasks'+task_id, 'DELETE', '')
                                    .catch(err => console.log(err + ' Error when trying to delete task.'));
                            });
                        }));
                    })); 
                    // check links for snapshots
                    console.log('Checking for links that need a snapshot...');
                    let links = await this.api.req('/links?need_snapshot=true', 'GET', '', true).catch(err => {
                        console.log(err + " Error when getting links that need snapshot.");
                        return null;
                    });
                    if (!links)
                        continue mainLoop;
                    // create a snapshot task for every link
                    await Promise.all(links.map(async link => {
                        console.log('Creating task to snapshot link ['+link.id+']...');
                        let task_id = await this.api.req('/tasks', 'POST', {
                            link_id: link.id,
                            type: 'rt.snapshot.js', 
                            started: null, 
                            ended: null, 
                            status: 'pending'
                        }, false).catch(err => {
                            console.log(err + " Error when creating tasks.");
                            return null;
                        });
                        if (!task_id)
                            return;
                        // create snapshot
                        console.log('Creating snapshot for task ['+task_id+']...');
                        await this.api.req('/links/'+link.id+'/snapshots', 'POST', {
                            task_id: task_id
                        }, false).catch(err => {
                            console.log(err + " Error when creating snapshot for task. Deleting task...");
                            return this.api.req('/tasks'+task_id, 'DELETE', '')
                                .catch(err => console.log(err + ' Error when trying to delete task.'));
                        });
                    }))
                }
                else if (tasks.length > 0)
                    tasks.map(task => this.queued_tasks.push(task));
            }
            //clearInterval(this.interval);
            // while tasks can be added based off the number of threads
            while (this.active_tasks.length < this.config.threads){
                if (this.queued_tasks.length === 0)
                    break;
                let task = this.queued_tasks.shift();
                console.log(task);
                let newThread = fork('./task.js', [task.id, task.link.link, task.type, task.started, task.ended, task.status]);

                // on exit remove from active tasks
                newThread.on('exit', code => {
                    let index = this.active_tasks.indexOf(newThread);
                    if (index !== -1) {
                        this.active_tasks.splice(index, 1);
                    }
                });
                this.active_tasks.push(newThread);
            }
        }
    }
}

module.exports = BotManager;