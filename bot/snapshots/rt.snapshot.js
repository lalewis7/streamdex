const Config = require("../config.json");

async function execute(id, page, api){
    if (!await api.req('/tasks/'+id, 'PUT', {started: Date.now(), status: 'in progress'}, false).catch(err => {
        console.log(err);
        return null;
    }))
        return;
    let contents = {};
    // title
    try{
        await page.waitForSelector(Config.RottenTomatoes.title);
        contents.title = await page.$eval(Config.RottenTomatoes.title, el => el.getAttribute('content'));
    } catch(err){
        console.log('Failed to collect title');
    }
    // description
    try{
        await page.waitForSelector(Config.RottenTomatoes.description);
        contents.description = await page.$eval(Config.RottenTomatoes.description, el => el.innerText);
    } catch(err){
        console.log('Failed to collect description');
    }

    // movie stuff
    if (await page.$(Config.RottenTomatoes.movie_section)){
        // movie info
        try {
            await page.waitForSelector(Config.RottenTomatoes.movie_info_list);
            contents.movie_info = (await page.$$eval(Config.RottenTomatoes.movie_info_item, elements => {
                let items = {};
                elements.map(el => items[el.querySelector('div.meta-label').innerText.split(':')[0]] = el.querySelector('div.meta-value').innerText);
                return items;
            }));
        } catch (err){
            console.log('failed to read movie info');
        }
        // maturity
        try{
            contents.maturity_rating = contents.movie_info['Rating'].split('(')[0].trim();
        } catch(err){
            console.log(err);
            console.log('Failed to collect maturity_rating');
        }
        // rating
        try{
            await page.waitForSelector(Config.RottenTomatoes.rating_1);
            contents.rating = await page.evaluate((r1, r2, r3) => {
                return document.querySelector(r1).shadowRoot.querySelector(r2).shadowRoot.querySelector(r3).innerText;
            }, Config.RottenTomatoes.rating_1, Config.RottenTomatoes.rating_2, Config.RottenTomatoes.rating_3);
        } catch(err){
            console.log('Failed to collect rating');
        }
        // release date
        try{
            if (contents.movie_info['Release Date (Theaters)'])
                contents.rel_date = contents.movie_info['Release Date (Theaters)'].split('  ')[0];
            else
                contents.rel_date = contents.movie_info['Release Date (Streaming)'];
        } catch(err){
            console.log(err);
            console.log('Failed to collect rel_date');
        }
        // runtime
        try{
            let runtimeText = contents.movie_info['Runtime'].match(/([0-9]+[a-z]+)/gi);
            contents.runtime = 0;
            runtimeText.map(len => {
                if (len.length >= 2 && len.charAt(len.length - 1) === 'h')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 1)) * 60;
                else if (len.length >= 2 && len.substring(len.length - 1) === 'm')
                    contents.runtime += Number.parseInt(len.substring(0, len.length - 1));
            })
        } catch(err){
            console.log(err);
            console.log('Failed to collect runtime');
        }
        // genres
        try{
            contents.genres = contents.movie_info['Genre'].split(',').map(el => el.trim());
        } catch(err){
            console.log(err);
            console.log('Failed to collect genres');
        }
    }

    // tv shows
    if (await page.$(Config.RottenTomatoes.seasons_section)){
        let seasonLinks = [];
        // seasons links
        try {
            seasonLinks = await page.$$eval(Config.RottenTomatoes.season_link, links => links.map(el => el.href));
            console.log(seasonLinks);
        } catch (err){
            console.log('Failed to collect season links');
            console.log(err);
        }
        contents.seasons = [];
        // each season
        for (let seasonLink of seasonLinks){
            let season = {episodes: []};
            // season page
            try {
                await page.goto(seasonLink);
            } catch (err){
                console.log('Failed to switch to season link.')
            }
            // show info
            try {
                await page.waitForSelector(Config.RottenTomatoes.show_info_list);
                season.show_info = (await page.$$eval(Config.RottenTomatoes.show_info_item, elements => {
                    let items = {};
                    elements.map(el => items[el.querySelector('div.meta-label').innerText.split(':')[0]] = el.querySelector('div.meta-value').innerText);
                    return items;
                }));
            } catch (err){
                console.log('Failed to read show info');
            }
            // episodes
            let episodeLinks;
            // episode links
            try {
                episodeLinks = new Set(await page.$$eval(Config.RottenTomatoes.episode_link, links => links.map(el => el.href)));
                console.log(episodeLinks);
            } catch (err){
                console.log('Failed to collect episode links');
                console.log(err);
            }
            // episodes
            for (let episodeLink of episodeLinks.values()){
                let episode = {};
                // episode page
                try {
                    await page.goto(episodeLink);
                } catch (err){
                    console.log('Failed to switch to episode link.')
                }
                // episode title
                try{
                    await page.waitForSelector(Config.RottenTomatoes.episode_title);
                    episode.title = await page.$eval(Config.RottenTomatoes.episode_title, el => el.textContent.split('\n')[1].trim());
                } catch(err){
                    console.log('Failed to collect episode title');
                }
                // episode description
                try{
                    await page.waitForSelector(Config.RottenTomatoes.episode_description);
                    episode.description = await page.$eval(Config.RottenTomatoes.episode_description, el => el.innerText);
                } catch(err){
                    console.log('Failed to collect episode description');
                }
                // episode info
                try {
                    await page.waitForSelector(Config.RottenTomatoes.episode_info_list);
                    episode.episode_info = (await page.$$eval(Config.RottenTomatoes.episode_info_item, elements => {
                        let items = {};
                        elements.map(el => items[el.querySelector('div.meta-label').innerText.split(':')[0]] = el.querySelector('div.meta-value').innerText);
                        return items;
                    }));
                } catch (err){
                    console.log('Failed to read episode info');
                }
                // add episode to season
                console.log('adding episode...');
                console.log(episode);
                season.episodes.push(episode);
            }
            // add to contents
            console.log('adding season...');
            console.log(JSON.stringify(season, null, 2));
            contents.seasons.push(season);
        }
    }

    console.log(JSON.stringify(contents, null, 2));
    await api.req('/snapshots/'+id, 'PUT', {data: JSON.stringify(contents)}, false);
    await api.req('/tasks/'+id, 'PUT', {ended: Date.now(), status: 'completed'}, false);
}

module.exports = execute;