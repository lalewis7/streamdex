// controllers
const userController = require('../controllers/user.js');
const tokenController = require('../controllers/token.js');
const titleController = require('../controllers/title.js');
const ratingController = require('../controllers/user.rating.js');

// models
const User = require('../models/user.js');
const Rating = require('../models/rating.js');

// helpers
const {editModel, dataMissingParameter} = require('./common.js');
const { sha256 } = require('js-sha256');

/**
 * Finds all users in database using optional queries.
 * Queries:
 * p -> select page to view
 * q -> a search query
 * @param {Object} query object with all query inputs
 */
 function getUsers(query){
    var page = query.p === undefined ? 0 : query.p;
    var controller;
    let users = [];
    if (query.q === undefined || query.q === '')
        controller = userController.findAllUsers(page);
    else 
        controller = userController.searchAllUsers(query.q, page);
    return controller.then(usrs => {
        // convert to class
        var initPromises = [];
        for (let userData of usrs){
            let user = new User(userData);
            initPromises.push(user.init());
            users.push(user);
        }
        return Promise.all(initPromises);
    }).then(() => {
        return users;
    })
}

/**
 * Searches for a user matching the id.
 * @param {String} id 
 */
function getUserByID(id){
    let user;
    // search for user
    return userController.findUsersByID(id)
        .then(users => {
            // user does not exist
            if (users.length == 0)
                return Promise.reject({http_msg: "User does not exist.", http_code: 404});
            user = new User(users[0]);
            return user.init();
        })
        .then(() => {
            return user;
        })
}

/**
 * Finds the user who the token is addessed to. Throws an error if the token does not exist or owner cannot be found.
 * Require that tokens not be expired using active parameter.
 * @param {String} token 
 * @param {Boolean} active
 */
function getUserByToken(token, active = true){
    let user;
    // search for token
    return tokenController.selectTokensByToken(token)
        .then(tokens => {
            // token does not exist
            if (tokens.length == 0)
                return Promise.reject("Invalid token.");
            // token has expired
            if (active && tokens[0].expires < Date.now())
                return Promise.reject("Token expired.");
            // find owner of token
            return userController.findUsersByID(tokens[0].user);
        })
        .then(users => {
            // owner does not exist
            if (users.length == 0)
                return Promise.reject("User does not exist.");
            user = new User(users[0]);
            return user.init();
        })
        .then(() => {
            return user;
        })
}

/**
 * Inserts a new user into the database assuming the all the data is valid.
 * @param {Object} data user data
 */
function createUser(data){
    // ensure all parameters exist
    if (!data.handle)
        return Promise.reject("Missing handle parameter.");
    if (!data.email)
        return Promise.reject("Missing email parameter.");
    if (!data.password)
        return Promise.reject("Missing password parameter.");
    // create user obj and populate information
    let user = new User();
    let invalid = user.validate(data, {admin: false});
    if (invalid.length > 0)
        return Promise.reject(invalid[0] + " invalid.");
    return editModel(user, data, {admin: false})
        .then(() => {
            return user.insert();
        })
}

/**
 * Edits the data of the user if it is permitted.
 * @param {int} id id of user that info is being changed for
 * @param {Boolean} admin does the user making the request have admin priv
 * @param {Object} data new data for the user
 */
async function editUser(id, admin, data){
    const users = await userController.findUsersByID(id);
    // user does not exist
    if (users.length == 0)
        return Promise.reject("User does not exist.");
    let user = new User(users[0]);
    await user.init();
    if (data.handle && data.handle !== user.get().handle){
        const handleUsers = await userController.findUsersByHandle(data.handle);
        if (handleUsers.length > 0)
            return Promise.reject("Handle taken.");
    }
    if (data.password){
        data.password = sha256(data.password);
    }
    user.edit(data, {admin: admin});
    await user.save();
}

/**
 * Deletes a user
 * @param {String} id 
 */
function deleteUser(id){
    return userController.findUsersByID(id).then(users => {
        if (users.length == 0)
            return Promise.reject('User does not exist.');
        let user = new User(users[0]);
        return user.delete();
    })
    
}

function insertRating(user, title, data, requester){
    // ensure all parameters exist
    let param = dataMissingParameter(data, ["positive"]);
    if (param)
        return Promise.reject("Missing " + param + " parameter.");
    
    return userController.findUsersByID(user)
        .then(users => {
            if (users.length === 0)
                return Promise.reject("User does not exist.");
            return titleController.getTitlesByID(title);
        })
        .then(titles => {
            if (titles.length === 0)
                return Promise.reject("Title does not exist.");
            return ratingController.findUserRating(user, title);
        })
        .then(ratings => {
            if (ratings.length > 0)
                return Promise.reject("Rating already exists.");
            let rating = new Rating();
            rating.override({user_id: user, title_id: title});
            return editModel(rating, data, requester);
        })
        .then(rating => {
            return rating.insert();
        });
}

function editRating(user, title, data, requester) {
    // ensure all parameters exist
    let param = dataMissingParameter(data, ["positive"]);
    if (param)
        return Promise.reject("Missing " + param + " parameter.");

    return userController.findUsersByID(user)
        .then(users => {
            if (users.length === 0)
                return Promise.reject("User does not exist.");
            return titleController.getTitlesByID(title);
        })
        .then(titles => {
            if (titles.length === 0)
                return Promise.reject("Title does not exist.");
            return ratingController.findUserRating(user, title);
        })
        .then(ratings => {
            if (ratings.length === 0)
                return Promise.reject("Rating does not exist.");
            let rating = new Rating(ratings[0]);
            return editModel(rating, data, requester);
        })
        .then(rating => {
            return rating.save();
        })
}

function deleteRating(user, title) {
    return userController.findUsersByID(user)
        .then(users => {
            if (users.length === 0)
                return Promise.reject("User does not exist.");
            return titleController.getTitlesByID(title);
        })
        .then(titles => {
            if (titles.length === 0)
                return Promise.reject("Title does not exist.");
            let rating = new Rating();
            rating.override({user_id: user, title_id: title});
            return rating.delete();
        })
}

function getRating(user, title) {
    return userController.findUsersByID(user)
        .then(users => {
            if (users.length === 0)
                return Promise.reject("User does not exist.");
            return titleController.getTitlesByID(title);
        })
        .then(titles => {
            if (titles.length === 0)
                return Promise.reject("Title does not exist.");
            return ratingController.findUserRating(user, title);
        })
        .then(ratings => {
            if (ratings.length === 0)
                return Promise.reject("Rating does not exist.");
            let rating = new Rating(ratings[0]);
            return rating.get(true);
        })
}

module.exports = {
    getUsers,
    getUserByID,
    getUserByToken,
    createUser,
    editUser,
    deleteUser,
    insertRating,
    editRating,
    deleteRating,
    getRating
}