// controllers
const imageController = require('../controllers/image.js');

// models
const Image = require('../models/image.js');

// helpers
const fs = require('fs-extra');       //File System - for file manipulation
const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },

    filename: function (req, file, cb) {
        cb(null, req.img.id+"."+file.mimetype.split("/")[1]);
    }
});

const upload = multer({ storage: storage }).single('file');

function preUpload(req, res, next){
    let img = new Image();
    delete req.body.filename;
    img.edit(req.body, {admin: req.user.admin});
    return img.insert().then(() => {
        req.img = img.get();
        return next();
    })
}

function postUpload(req){
    let img = new Image();
    img.override(req.img);
    if (req.file){
        img.edit({filename: req.file.filename}, {admin: req.user.admin});
        return img.save().then(() => {
            return img.get().id;
        });
    }
    else {
        return img.delete().then(() => {
            return Promise.reject({http_msg: "File Upload failed.", http_code: 500});
        })
    }
}

function getImage(id, requester){
    let image;
    return imageController.getImage(id)
        .then(images => {
            if (images.length === 0)
                return Promise.reject({http_msg: "Image does not exist.", http_code: 404});
            image = new Image(images[0]);
            if (!image.get().public && !requester.admin)
                return Promise.reject({http_msg: "Access denied.", http_code: 403});
            return path.join(__dirname, "../public/images/", image.get().filename);
        })
}

function getImageDetails(id){
    return imageController.getImage(id)
        .then(images => {
            if (images.length == 0)
                return Promise.reject({http_msg: "Image does not exist.", http_code: 404});
            let image = new Image(images[0]);
            return image.get(true);
        })
}

function getImages(query){
    var page = query.p === undefined ? 0 : query.p;
    var controller;
    if (query.q === undefined || query.q === '')
        controller = imageController.findAllImages(page);
    else 
        controller = imageController.searchAllImages(query.q, page);
    return controller.then(images => images.map(img => new Image(img).get(true)));
}

function editImage(id, data, requester){
    return imageController.getImage(id)
        .then(images => {
            if (images.length == 0)
                return Promise.reject({http_msg: "Image does not exist.", http_code: 404});
            let image = new Image(images[0]);
            image.edit(data, requester);
            return image.save();
        })
}

function deleteImage(id){
    let image;
    return imageController.getImage(id)
        .then(images => {
            if (images.length === 0)
                return Promise.reject({http_msg: "Image does not exist.", http_code: 404});
            image = new Image(images[0]);
            return image.delete();
        })
        .then(() =>
            new Promise((res, rej) => {
                fs.unlink("./public/images/"+image.get().filename, (err) => {
                    if (err) rej(err);
                    res();
                });
            })
        )
}

module.exports = {
    upload,
    deleteImage,
    getImage,
    editImage,
    getImageDetails,
    getImages,
    preUpload,
    postUpload
}