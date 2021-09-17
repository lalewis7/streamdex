// controllers
const ratingController = require('../controllers/user.rating.js');

// models
const {Model, StringAttribute, BooleanAttribute} = require('./model.js');

class Rating extends Model {

    constructor(data) {
        super([
            new StringAttribute({
                name: "user_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new StringAttribute({
                name: "title_id",
                editable: false,
                visible: false,
                adminProtected: true
            }),
            new BooleanAttribute({
                name: "positive",
                editable: true,
                visible: true,
                adminProtected: false
            }),
        ], data)
    }

    // async init(){}

    async insert(){
        let r = this.get();
        await ratingController.insertUserRating(r.user_id, r.title_id, r.positive);
    }

    async save(){
        let r = this.get();
        await ratingController.updateUserRating(r.user_id, r.title_id, r.positive);
    }

    async delete(){
        let r = this.get();
        await ratingController.deleteUserRating(r.user_id, r.title_id);
    }

}

module.exports = Rating;