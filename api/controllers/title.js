var util = require('../util.js');
const config = require('../config.json');

module.exports = {

    getTitlesByID(title_id){
        return util.dbPromise("SELECT * FROM titles WHERE title_id = ?", title_id);
    },

    findAllTitles(page = 0){
        return util.dbPromise('SELECT * FROM titles LIMIT ? OFFSET ?', config.title_page_length, page*config.title_page_length);
    },

    searchAllTitles(search, page = 0){
        return util.dbPromise('SELECT * FROM titles WHERE MATCH(title) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT ? OFFSET ?', search, config.title_page_length, page*config.title_page_length);
    },

    insertTitle(title_id, title, cover_image, maturity_rating, description){
        return util.dbPromise("INSERT INTO titles (title_id, title, cover_image, maturity_rating, description) VALUES (?,?,?,?,?)", title_id, title, cover_image, maturity_rating, description);
    },

    updateTitle(title_id, title, cover_image, maturity_rating, description) {
        return util.dbPromise("UPDATE titles SET title = ?, cover_image = ?, maturity_rating = ?, description = ? WHERE title_id = ?", title, cover_image, maturity_rating, description, title_id);
    },

    deleteTitle(title_id){
        return util.dbPromise("DELETE FROM titles WHERE title_id = ?", title_id);
    }

}