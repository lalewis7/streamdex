async function execute(id, page, api){
    await api.req('/tasks/'+id, 'PUT', {started: Date.now(), status: 'in progress'}, false);
    let contents = {
        links: []
    };

    let links = await page.$$eval('a', els => els.map(el => el.href));
    links.map(link => {
        if (link === null || link === undefined || (link.indexOf('https://www.rottentomatoes.com/tv/') !== 0 && 
            link.indexOf('https://www.rottentomatoes.com/m/') !== 0))
            return;
        let newLink = 'https://www.rottentomatoes.com/' + link.split('/')[3] + '/' + link.split('/')[4];
        if (contents.links.indexOf(newLink) === -1)
            contents.links.push(newLink);
    });

    console.log(contents);
    
    await Promise.all(contents.links.map(async link => {
        await api.req('/links', 'POST', {
            link: link
        }, false);
    }));

    await api.req('/tasks/'+id, 'PUT', {ended: Date.now(), status: 'completed'}, false);
}

module.exports = execute;