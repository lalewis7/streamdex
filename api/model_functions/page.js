// models
const List = require('../models/list.js');
const Title = require('../models/title.js');

// helpers
const {titleExists, listExists} = require('./common.js');


function getPage(page, user){

    if (page.toLowerCase() === 'new')
        return newPage(user);
    else if (page.toLowerCase() === 'browse')
        return browsePage(user);
    else if (page.toLowerCase() === 'popular')
        return popularPage(user);
    else
        return Promise.reject({http_msg: "Page does not exist.", http_code: 404});

}

function newPage(user){
    const list_ids = ['742d8529', '4bcac230', '5f5101ec', '6a29f82a', '82928be0', 'bc165d5f'];
    let promises = [];
    list_ids.map(id => {
        let list;
        promises.push(
            listExists(id)
                .then(listsData => {
                    list = new List(listsData[0]);
                    return list.init();
                })
                .then(() => listToPageList(list))
        )
    });
    return Promise.all(promises);
}

function browsePage(user){
    return this.newPage(user);
}

function popularPage(user){
    return this.newPage(user);
}

function listToPageList(list){
    let l = list.get();
    delete l.updated_last;
    delete l.id;
    let promises = [];
    l.titles.map(title => {
        let t;
        promises.push(
            titleExists(title.title_id)
                .then(titleData => {
                    t = new Title([], titleData[0]);
                    return t.init();
                })
                .then(() => {
                    return {title: t.get(true), ranking: title.ranking}
                })
        );
    })
    return Promise.all(promises)
        .then((titles) => {
            l.titles = [];
            titles.sort((a, b) => a.ranking - b.ranking);
            titles.map(title => {
                l.titles.push(title.title);
            });
            return l;
        });
}

module.exports = {
    getPage
}