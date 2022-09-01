const crypto = require('crypto');
const { sha256 } = require('js-sha256');

// controllers
var tokenController = require('../controllers/token.js');
var userController = require('../controllers/user.js');
var userStreamsController = require('../controllers/user.streams.js');
var userRatingsController = require('../controllers/user.rating.js');

// models
var model = require('./model.js');

// helpers
var validate = require('../validate.js');
var config = require('../config.json');
const util = require('../util.js');
    
class User extends model.Model {

    constructor(data){
        super([
            new model.StringAttribute({
                name: "id",
                db_name: "user_id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new model.StringAttribute({
                name: "handle",
                editable: true,
                visible: true,
                adminProtected: false,
                validate: validate.handle
            }),
            new model.StringAttribute({
                name: "email",
                editable: true,
                visible: true,
                adminProtected: false,
                validate: validate.email
            }),
            new model.BooleanAttribute({
                name: "email_verified",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new model.StringAttribute({
                name: "password",
                editable: true,
                visible: true,
                adminProtected: false,
                validate: validate.password
            }),
            new model.StringAttribute({
                name: "country",
                editable: true,
                visible: true,
                adminProtected: false
            }),
            new model.BooleanAttribute({
                name: "locked",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new model.BooleanAttribute({
                name: "admin",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new model.BooleanAttribute({
                name: "super_admin",
                editable: true,
                visible: true,
                adminProtected: true,
            }),
            new UserStreamsAttribute({
                name: "streams",
                editable: true,
                visible: true,
                adminProtected: false
            })
        ], data);
    }

    async init(){
        const streams = await userStreamsController.findAllUserStreams(this.get().id);
        for (let stream of streams)
            this.streams.value.push(stream.platform);
    }

    async insert(){
        // make sure handle is available
        const users = await userController.findUsersByHandle(this.get().handle);
        if (users.length > 0)
            throw new Error("Handle taken.");
        const id = await getNewID();
        // update id and password
        this.override({ id: id, password: sha256(this.get().password) });
        let u = this.get();
        await userController.insertUser(u.id, u.handle, u.email, u.email_verified, u.password, u.country, u.locked, u.admin, u.super_admin);
    }

    async save(){
        let u = this.get(false);
        await userController.updateUserByID(u.id, u.handle, u.email, u.email_verified, u.password, u.country, u.locked, u.admin, u.super_admin);

        // streams
        const oldStreams = await userStreamsController.findAllUserStreams(this.get().id);
        const newStreams = u.streams;
        var commands = [];
        oldStreamLoop: for (let oldStream of oldStreams) {
            for (let newStream of newStreams)
                if (oldStream.platform === newStream)
                    continue oldStreamLoop;
            // old stream not in new stream (delete)
            commands.push(userStreamsController.deleteUserStream(this.get().id, oldStream.platform));
        }
        newStreamLoop: for (let newStream of newStreams) {
            for (let oldStream of oldStreams)
                if (oldStream.platform === newStream)
                    continue newStreamLoop;
            // new stream not found in old stream (create)
            commands.push(userStreamsController.insertUserStream(this.get().id, newStream));
        }
        await Promise.all(commands);
    }

    async delete(){
        let u = this.get(false);
        await userController.deleteUser(u.id);
        await userStreamsController.deleteAllUserStreams(u.id);
    }

}

class UserStreamsAttribute extends model.Attribute {

    constructor(conf){
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (typeof v !== 'string')
                    return false;
            return true;
        };
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

module.exports = User;