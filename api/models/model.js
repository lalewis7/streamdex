class Model {

    constructor(attr, data){
        attr.map(a => {
            this[a.name] = a;
            // from database
            if (data){
                let val = data[a.name];
                if (a.db_name)
                    val = data[a.db_name];
                if (val === undefined)
                    this[a.name].value = a.defaultValue;
                else if (a.convertDbValue)
                    this[a.name].value = a.convertDbValue(val);
                else
                    this[a.name].value = val;
            }
            else {
                this[a.name].value = a.defaultValue;
            }
        });
    }

    validate(data, requester){
        let fails = [];
        for (let key in data){
            let attr = this[key];
            if (!attr || // attribute does not exist
                !attr.editable || // attribute is not editable
                (attr.adminProtected && !requester.admin) || // attribute is admin protected and requester is not admin
                (attr.validate && !attr.validate(data[key]))) // attribute has validate fn and it does not pass
                fails.push(key);
        }
        return fails;
    }

    edit(data, requester){
        let fails = this.validate(data, requester);
        if (fails.length > 0)
            return fails;
        for (let key in data){
            this[key].value = this[key].initValue(this, data[key], requester);
        }
        return [];
    }

    override(data){
        for (let key in data)
            this[key].value = data[key];
    }

    get(visibleOnly = false){
        let data = {};
        for (let key in this)
            if (!visibleOnly || this[key].visible)
                data[key] = this[key].getValue(visibleOnly);
        return data;
    }

}

class Attribute {
    
    constructor(config){
        this.name = undefined;
        this.db_name = undefined;
        this.editable = false;
        this.visible = true;
        this.adminProtected = false;
        this.validate = (val) => {return true};
        this.convertDbValue = (val) => {return val};
        this.initValue = (model, val, requester) => {return val};
        this.defaultValue = undefined;
        this.value = undefined;
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

    getValue(visibleOnly) {
        return this.value;
    }

}

class StringAttribute extends Attribute {

    constructor(config){
        super(config);
        this.defaultValue = "";
        this.validate = (val) => {return typeof val === "string";};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class NumberAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = 0;
        this.validate = (val) => {return typeof val === "number";};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class BooleanAttribute extends Attribute {

    constructor(config) {
        super(config);
        this.defaultValue = false;
        this.validate = (val) => {return typeof val === "boolean";};
        this.convertDbValue = (val) => {return val == 1 ? true : false;};
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

}

class DateAttribute extends Attribute {
    
    constructor(config) {
        super(config);
        this.defaultValue = null;
        this.validate = (val) => {
            let dateSplit = val.split('-');
            if (dateSplit.length != 3)
                return false;
            if (isNaN(dateSplit[0]) || isNaN(dateSplit[1]) || isNaN(dateSplit[2]))
                return false;
            let month = parseInt(dateSplit[1]);
            let day = parseInt(dateSplit[2]);
            if (month < 1 || month > 12)
                return false;
            switch (month){
                case 1: // jan
                    if (day > 31) return false;
                    break;
                case 2: // feb
                    if (day > 29) return false;
                    break;
                case 3: // mar
                    if (day > 31) return false;
                    break;
                case 4: // apr
                    if (day > 30) return false;
                    break;
                case 5: // may
                    if (day > 31) return false;
                    break;
                case 6: // jun
                    if (day > 30) return false;
                    break;
                case 7: // jul
                    if (day > 31) return false;
                    break;
                case 8: // aug
                    if (day > 31) return false;
                    break;
                case 9: // sep
                    if (day > 30) return false;
                    break;
                case 10: // oct
                    if (day > 31) return false;
                    break;
                case 11: // nov
                    if (day > 30) return false;
                    break;
                case 12: // dec
                    if (day > 31) return false;
                    break;
            }
            return true;
        };
        this.convertDbValue = (val) => {
            if (val)
                return val.getFullYear()+"-"+(val.getMonth()+1)+"-"+val.getDate();
            return val;
        };
        // update with any custom config given
        for (let key in config)
            this[key] = config[key];
    }

    // getValue(visibleOnly){
    //     let d = this.value;
    //     return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    // }

}

module.exports = {
    Model, 
    Attribute, 
    StringAttribute, 
    NumberAttribute, 
    BooleanAttribute,
    DateAttribute
}