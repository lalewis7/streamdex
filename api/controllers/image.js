var util = require('../util.js');
var config = require('../config.json');

module.exports = {

    getImage(image_id){
        return util.dbPromise("SELECT * FROM images WHERE image_id = ?", image_id);
    },

    findAllImages(page = 0){
        return util.dbPromise('SELECT * FROM images LIMIT ? OFFSET ?', config.image_page_length, page*config.image_page_length);
    },

    searchAllImages(search, page = 0){
        return util.dbPromise('SELECT * FROM images WHERE MATCH(description, image_id, filename) AGAINST (? IN BOOLEAN MODE) LIMIT ? OFFSET ?', "*"+search+"*", config.image_page_length, page*config.title_page_length);
    },

    createImage(image_id, filename, description, publicVal){
        return util.dbPromise("INSERT INTO images (image_id, filename, description, public) VALUES (?, ?, ?, ?)", image_id, filename, description, publicVal);
    },

    editImage(image_id, filename, description,  publicVal){
        return util.dbPromise("UPDATE images SET filename = ?, public = ?, description = ? WHERE image_id = ?", filename, publicVal, description, image_id);
    },

    deleteImage(image_id){
        return util.dbPromise("DELETE FROM images WHERE image_id = ?", image_id);
    }

}