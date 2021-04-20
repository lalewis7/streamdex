module.exports = {
    /**
     * Checks that the value is a valid handle.
     * Valid handles must be letters and numbers only ranging from 4-32 characters.
     * @param {String} val 
     */
    handle(val){
        var validChars = "^[0-9a-zA-Z]+$";
        return val.match(validChars) && val.length >= 4 && val.length <= 32;
    },

    /**
     * Checks that the value is a valid email.
     * Valid emails must be less than or equal to 64 characters.
     * @param {String} val 
     */
    email(val){
        var validEmail = /\S+@\S+\.\S+/;
        return val.match(validEmail) && val.length <= 64;
    },

    /**
     * Checks that the value is a valid password.
     * Valid passwords must be from 8-64 characters.
     * @param {String} val 
     */
    password(val){
        return val.length >= 8 && val.length <= 64;
    }
}