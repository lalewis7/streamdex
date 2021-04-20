const crypto = require('crypto');
const { sha256 } = require('js-sha256');
var authController = require('../controllers/auth.js');
var userController = require('../controllers/user.js');
var model = require('./model.js');
var validate = require('../validate.js');
var config = require('../config.js');

module.exports = {
    User: class User extends model.Model {
        constructor(data){
            super([
                model.getAttributeConfig('id', false, true, true, ''),
                model.getAttributeConfig('handle', true, true, false, ''),
                model.getAttributeConfig('email', true, true, false, ''),
                model.getAttributeConfig('email_ver', true, true, true, false),
                model.getAttributeConfig('password', true, false, false, ''),
                model.getAttributeConfig('admin', true, true, true, false),
            ], data);
        }
    },

    /**
     * Finds all users in database.
     */
    getUsers(){
        // get users
        return userController.findAllUsers()
            .then(users => {
                // convert to class
                var userArray = [];
                for (let i = 0; i < users.length; i++){
                    userArray.push(new User(users[i]));
                }
                return userArray;
            });
    },

    /**
     * Searches for a user matching the id.
     * @param {String} id 
     */
    getUserByID(id){
        // search for user
        return userController.findUsersByID(id)
            .then(users => {
                // user does not exist
                if (users.length == 0)
                    throw "User does not exist.";
                return new User(users[0]);
            });
    },

    /**
     * Finds the user who the token is addessed to. Throws an error if the token does not exist or owner cannot be found.
     * Require that tokens not be expired using active parameter.
     * @param {String} token 
     * @param {Boolean} active
     */
    getUserByToken(token, active = true){
        // search for token
        return authController.selectTokensByToken(token)
            .then(tokens => {
                // token does not exist
                if (tokens.length == 0)
                    throw "Invalid token.";
                // token has expired
                if (active && tokens[0].expires < Date.now())
                    throw "Token expired.";
                // find owner of token
                return userController.findUsersByID(tokens[0].user);
            })
            .then(users => {
                // owner does not exist
                if (users.length == 0)
                    throw "User does not exist.";
                return new User(users[0]);
            });
    },

    /**
     * Inserts a new user into the database assuming the all the data is valid.
     * @param {Object} data user data
     */
    createUser(data){
        // ensure all parameters exist
        if (!data.handle)
            throw "Missing handle parameter.";
        if (!data.email)
            throw "Missing email parameter.";
        if (!data.password)
            throw "Missing password parameter.";
        // validate information
        if (!validate.handle(data.handle))
            throw "Handle invalid.";
        if (!validate.email(data.email))
            throw "Email invalid.";
        if (!validate.password(data.password))
            throw "Password invalid.";
        // create user obj and populate information
        var user = new this.User();
        user.edit(data, false);
        // make sure handle is available
        return userController.findUsersByHandle(data.handle).then(users => {
            if (users.length > 0)
                throw "Handle taken.";
            return getNewID()
        })
        // get new user id
        .then(id => {
            // update id and password
            user.forceEdit({id: id, password: sha256(data.password)});
            // get user data
            let u = user.get();
            // add to db
            return userController.insertUser(u.id, u.handle, u.email, u.email_ver, u.password, u.admin);
        });
    },

    /**
     * TODO
     * @param {Object} data 
     */
    editUser(data){
        // TODO
    },

    /**
     * TODO
     * @param {String} id 
     */
    deleteUser(id){
        // TODO
    }
}


/**
 * Creates random id that has not already been assigned to user.
 */
function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.user_id_length).toString('hex');
    return userController.findUsersByID(id).then(usrs => {
        // id does not exist
        if (usrs.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}