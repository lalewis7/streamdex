// controllers
const seasonController = require('../controllers/season.js');

// models
const model = require('./model.js');
const Title = require('./title.js');
const Season = require('./season.js');

class Show extends Title {

    constructor(data) {
        super([
            new SeasonsAttribute({
                name: "seasons",
                editable: false,
                visible: true,
                adminProtected: true
            })
        ], data);
    }

    async init(){
        await super.init();
        const seasons = await seasonController.getAllSeasons(this.get().id);
        console.log(seasons);
        for (let s of seasons){
            let season = new Season(s);
            await season.init();
            this.seasons.value.push(season);
        }
    }

    async insert(){
        await super.insert();
    }

    async save(){
        await super.save();
        let self = this.get();
        // delete not included seasons
        const oldSeasons = await seasonController.getAllSeasons(this.get().id);
        outer: for (let oldSeason of oldSeasons) {
            let val = new Season(oldSeason);
            for (let s of self.seasons){
                if (s.id == val.get().id)
                    continue outer;
            }
            await val.delete();
        }
        // add / edit seasons
        outer: for (let s of this.seasons.value){
            let val = s.get();
            for (let oldSeason of oldSeasons){
                let oldVal = new Season(oldSeason).get();
                if (val.id === oldVal.id){
                    await s.save();
                    continue outer;
                }
            }
            await s.insert();
        }
    }

    async delete(){
        for (let season of this.seasons.value){
            await season.delete();
        }
        await super.delete();
    }

}

class SeasonsAttribute extends model.Attribute {

    constructor(conf){
        super(conf);
        this.defaultValue = [];
        this.validate = (val) => {
            if (typeof val !== 'object' || !Array.isArray(val))
                return false;
            for (let v of val)
                if (!new Season().validate(v, {admin: true}))
                    return false;
            return true;
        };
        this.initValue = (model, val, requester) => {
            let seasons = [];
            for (let v of val){
                let season;
                for (let s of model.seasons.value)
                    if (s.get().id === v.id)
                        season = s;
                if (season === undefined)
                    season = new Season({title_id: model.get().id});
                season.edit(v, requester);
                seasons.push(season);
            }
            return seasons;
        }
    }

    getValue(visibleOnly){
        let vals = [];
        for (let val of this.value)
            vals.push(val.get(visibleOnly));
        return vals;
    }

}

module.exports = Show;