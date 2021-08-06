// controllers
const imageController = require('../controllers/image.js');

// models
const {Model, StringAttribute, BooleanAttribute} = require('./model.js');

// helpers
const crypto = require('crypto');
var config = require('../config.json');

class Image extends Model {

    constructor(data){
        super([
            new StringAttribute({
                db_name: "image_id",
                name: "id",
                editable: false,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "filename",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new StringAttribute({
                name: "description",
                editable: true,
                visible: true,
                adminProtected: true
            }),
            new BooleanAttribute({
                name: "public",
                editable: true,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    // async init(){}

    async insert(){
        const id = await getNewID();
        // update id and password
        this.override({ id: id });
        let i = this.get();
        await imageController.createImage(i.id, i.filename, i.description, i.public);
    }

    async save(){
        let i = this.get();
        await imageController.editImage(i.id, i.filename, i.description, i.public);
    }

    async delete(){
        await imageController.deleteImage(this.get().id);
    }

}

function getNewID(){
    // create random id
    let id = crypto.randomBytes(config.image_name_length).toString('hex');
    return imageController.getImage(id).then(images => {
        // id does not exist
        if (images.length == 0)
            return id;
        // id exists try again
        return getNewID();
    })
}

module.exports = Image;