var util = require('../util.js');
const config = require('../config.json');

module.exports = {

    getTitlesByID(title_id){
        return util.dbPromise("SELECT *, FLOOR((SELECT COUNT(IF(positive=1,1,NULL))/COUNT(*)*100 FROM user_ratings GROUP BY title_id HAVING title_id = T.title_id)) as streamdex_rating FROM titles as T WHERE title_id = ?", title_id);
    },

    findAllTitles(page = 0){
        return util.dbPromise('SELECT * FROM titles LIMIT ? OFFSET ?', config.title_page_length, page*config.title_page_length);
    },

    searchAllTitles(search, page = 0){
        return util.dbPromise('SELECT * FROM titles WHERE MATCH(title) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.title_page_length, page*config.title_page_length);
    },

    insertTitle(title_id, title, cover_image, maturity_rating, description, imdb_link, imdb_rating, rotten_tomatoes_link, rotten_tomatoes_rating){
        return util.dbPromise("INSERT INTO titles (title_id, title, cover_image, maturity_rating, description, imdb_link, imdb_rating, rotten_tomatoes_link, rotten_tomatoes_rating) VALUES (?,?,?,?,?,?,?,?,?)",
            title_id, title, cover_image, maturity_rating, description, imdb_link, imdb_rating, rotten_tomatoes_link, rotten_tomatoes_rating);
    },

    updateTitle(title_id, title, cover_image, maturity_rating, description, imdb_link, imdb_rating, rotten_tomatoes_link, rotten_tomatoes_rating) {
        return util.dbPromise("UPDATE titles SET title = ?, cover_image = ?, maturity_rating = ?, description = ?, imdb_link = ?, imdb_rating = ?, rotten_tomatoes_link = ?, rotten_tomatoes_rating = ? WHERE title_id = ?", 
            title, cover_image, maturity_rating, description, imdb_link, imdb_rating, rotten_tomatoes_link, rotten_tomatoes_rating, title_id);
    },

    deleteTitle(title_id){
        return util.dbPromise("DELETE FROM titles WHERE title_id = ?", title_id);
    }

}