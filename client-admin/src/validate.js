export function username(val){
    var validChars = "^[0-9a-zA-Z]+$";
    return val.match(validChars) && val.length >= 4 && val.length <= 32;
}

export function email(val){
    var validEmail = /\S+@\S+\.\S+/;
    return val.match(validEmail) && val.length <= 64;
}

export function password(val){
    return val.length >= 8 && val.length <= 64;
}