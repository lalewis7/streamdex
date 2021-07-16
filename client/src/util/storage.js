export function getToken(){
    return sessionStorage.getItem('token');
}

export function setToken(val){
    sessionStorage.setItem('token', val);
}

export function removeToken(){
    sessionStorage.removeItem('token');
}

export function getFilterCountry(){
    return sessionStorage.getItem('filter_country');
}

export function setFilterCountry(val){
    sessionStorage.setItem('filter_country', val);
}

export function removeFilterCountry(val){
    sessionStorage.removeItem('filter_country');
}

/*
export function getID(){
    return sessionStorage.getItem('id');
}

export function getUsername(){
    return sessionStorage.getItem('username');
}

export function getEmail(){
    return sessionStorage.getItem('email');
}

export function isAdmin(){
    return sessionStorage.getItem('admin') === 'true';
}

export function isEmailVerified(){
    return sessionStorage.getItem('email_verified') === 'true';
}

export function setUsername(val){
    sessionStorage.setItem('username', val);
}

export function setEmail(val){
    sessionStorage.setItem('email', val);
}

export function setID(val){
    sessionStorage.setItem('id', val);
}

export function setAdmin(val){
    sessionStorage.setItem('admin', val);
}

export function setEmailVerified(val){
    sessionStorage.setItem('email_verified', val);
}
*/