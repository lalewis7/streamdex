import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import Config from './config.js';
import $ from 'jquery'; 

var Storage = require('./storage.js');
var Validate = require('./validate.js');

/**
 * Contains all inputs and labels for signup form
 * Used as child component for Login
 */
class SignupForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // form data
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',

            // input classes (bootstrap and design changes)
            usernameClass: '',
            emailClass: '',
            passwordClass: '',
            passwordConfirmClass: '',

            // invalid messages
            usernameInvalid: '',
        }
        // bind this
        this.handleChange = this.handleChange.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.usernameValidate = this.usernameValidate.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.emailValidate = this.emailValidate.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.passwordValidate = this.passwordValidate.bind(this);
        this.passwordConfirmChange = this.passwordConfirmChange.bind(this);
        // update parent
        this.sendData();
    }

    /**
     * Sends data to parent.
     */
    sendData = () => {
        this.props.getData({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        });
    }

    /**
     * called from onChange and changes any input in the component state with name = value
     * @param {Object} evt 
     */
    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            this.sendData();
        });
    }

    /**
     * Handles changes to username input
     * Checks if username is already taken
     * @param {Object} evt 
     */
    usernameChange (evt) {
        // set value
        this.setState({username: evt.target.value}, () => {
            this.sendData();
        });
        // validate data
        if (Validate.username(evt.target.value))
            this.setState({usernameClass: "is-valid"});
        // check if username is available
        fetch(Config.API+"handle/"+evt.target.value)
        .then(res => {
            if (res.status == 200 && Validate.username(evt.target.value))
                this.setState({usernameClass: "is-valid"});
            if (res.status != 200)
                this.setState({usernameClass: "is-invalid", usernameInvalid: "Username already taken."});
        }, 
        err => {
            console.log(err);
        });
    }

    /**
     * Checks if username is valid
     * Used for onBlur event (input losses focus)
     * @param {Object} evt 
     */
    usernameValidate (evt) {
        if (!Validate.username(evt.target.value))
            this.setState({usernameClass: "is-invalid", usernameInvalid: "Username must be 4-32 characters long and only contain letters and digits."});
    }

    /**
     * Handles changes to email input
     * @param {Object} evt 
     */
    emailChange (evt) {
        // set value
        this.setState({email: evt.target.value}, () => {
            this.sendData();
        });
        // email not required (no value is ok)
        if (evt.target.value === "")
            this.setState({emailClass: ""});
        // validate email
        if (Validate.email(evt.target.value))
            this.setState({emailClass: "is-valid"});
    }

    /**
     * Checks if email is valid
     * @param {Object} evt 
     */
    emailValidate (evt) {
        if (!Validate.email(evt.target.value) && evt.target.value !== "")
            this.setState({emailClass: "is-invalid"});
    }

    /**
     * Handles changes to password input
     * @param {Object} evt 
     */
    passwordChange(evt){
        this.setState({password: evt.target.value}, () => {
            this.sendData();
        });
        if (Validate.password(evt.target.value))
            this.setState({passwordClass: "is-valid"})
        if (!Validate.password(evt.target.value))
            this.setState({passwordClass: "is-invalid"});
    }

    /**
     * Checks if password is valid
     * @param {Object} evt 
     */
    passwordValidate (evt) {
        console.log("here");
        if (!Validate.password(evt.target.value))
            this.setState({passwordClass: "is-invalid"});
    }

    /**
     * Handles changes to confirm password change
     * @param {Object} evt 
     */
    passwordConfirmChange(evt){
        // set value
        this.setState({passwordConfirm: evt.target.value}, () => {
            this.sendData();
        });
        // only set to not valid if value is more or equal characters
        if (this.state.password !== evt.target.value && evt.target.value.length >= this.state.password.length)
            this.setState({passwordConfirmClass: "is-invalid"});
        else if (this.state.password === "")
            this.setState({passwordConfirmClass: ""});
        else if (this.state.password === evt.target.value)
            this.setState({passwordConfirmClass: "is-valid"});
    }

    render(){
        return <div>
            <div class="form-group">
                <label for="signupUsername">Username</label>
                <input type="text" class={"form-control "+this.state.usernameClass} id="signupUsername" placeholder="Username" value={this.state.username} onChange={this.usernameChange} onBlur={this.usernameValidate}/>
                <div class="invalid-feedback">{this.state.usernameInvalid}</div>
            </div>
            <div class="form-group">
                <label for="signupEmail">Email</label>
                <input type="email" class={"form-control "+this.state.emailClass} id="signupEmail" placeholder="Email" value={this.state.email} onChange={this.emailChange} onBlur={this.emailValidate}/>
                <div class="invalid-feedback">Email invalid.</div>
            </div>
            <div class="form-group">
                <label for="signupPassword">Password</label>
                <input type="password" class={"form-control "+this.state.passwordClass} id="signupPassword" placeholder="Password" value={this.state.password} onChange={this.passwordChange} onBlur={this.passwordValidate}/>
                <div class="invalid-feedback">Password must be 8-64 characters long.</div>
            </div>
            <div class="form-group">
                <label for="signupPasswordConfirm">Confirm Password</label>
                <input type="password" class={"form-control "+this.state.passwordConfirmClass} id="signupPasswordConfirm" placeholder="Confirm Password" value={this.state.passwordConfirm} onChange={this.passwordConfirmChange} />
                <div class="invalid-feedback">Passwords do not match.</div>
            </div>
        </div>
    }

}

class LoginForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // form data
            user: '',
            password: '',
        };
        // bind this
        this.handleChange = this.handleChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        // update parent
        this.sendData();
    }

    sendData = () => {
        this.props.getData({
            user: this.state.user,
            password: this.state.password
        });
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value }, () => {
            this.sendData();
        });
    }

    passwordChange (evt) {
        this.setState({password: evt.target.value}, () => {
            this.sendData();
        });
        this.setState({passwordClass: ""});
    }

    render(){
        return <div>
            <div class="form-group">
                <label for="loginUsername">Username / Email</label>
                <input type="text" class="form-control" id="loginUsername" placeholder="Username or Email" value={this.state.user} name="user" onChange={this.handleChange}/>
            </div>
            <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" class={"form-control "+this.props.passwordClass} id="loginPassword" placeholder="Password" value={this.state.password} name="loginPassword" onChange={this.passwordChange} />
                <div class="invalid-feedback">Username or password incorrect. Please try again.</div>
            </div>
        </div>
    }

}

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // is modal visible
            showLoginPage: true,
            loginData: {},
            signupData: {},
            loginError: 'test',
            passwordClass: ''
        }
        // bind this
        this.handleChange = this.handleChange.bind(this);
        this.swapPage = this.swapPage.bind(this);
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * Sets state login data used as callback for children.
     * @param {Object} data 
     */
    loginDataCB = (data) => {
        this.setState({loginData: data});
    }

    /**
     * Sets state signup data used as callback for children.
     * @param {Object} data 
     */
    signupDataCB = (data) => {
        this.setState({signupData: data});
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    /**
     * Signup attempt for user
     * @param {Object} evt 
     */
    signup (evt) {
        evt.preventDefault();
        // send post to create user
        fetch(Config.API+"users", 
        {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({handle: this.state.signupData.username, email: this.state.signupData.email, 
                password: this.state.signupData.password})
        })
        .then(res => {
            // successfully created user
            if (res.ok)
                // get token for newly created user
                fetch(Config.API+"auth",
                {
                    method: "GET",
                    headers: {'user': this.state.signupData.username, 'password': this.state.signupData.password}
                })
                .then(res => {
                    if (res.ok){
                        res.text().then(token => {
                            Storage.setToken(token);
                        });
                    } else {
                        console.log('Failed to login after signup');
                    }
                },
                err => {
                    console.log(err);
                });
                $('#loginModal').modal('hide');
        }, err => {
            console.log(err);
        })
    }

    /**
     * Login attempt (pressed login btn)
     * @param {Object} evt 
     */
    login (evt) {
        // do not submit form
        evt.preventDefault();
        console.log(this.state.loginData);
        // attempt to get token
        fetch(Config.API+"auth",
        {
            method: 'GET',
            headers: {'user': this.state.loginData.user, 'password': this.state.loginData.password}
        })
        .then(res => {
            // successful credentials
            if (res.ok){
                res.text().then(token => {
                    // save token
                    this.props.setToken(token);
                    // remove login page
                    $('#loginModal').modal('hide');
                    // update self info
                    fetch(Config.API+"self", {
                        method: 'GET',
                        headers: {'token': Storage.getToken()}
                    })
                    .then(res => res.json())
                    .then(self => {
                        this.props.setUser(self);
                    });
                });
            }
            // incorrect credentials
            else{
                this.setState({passwordClass: "is-invalid"});
            }
        },
        err => {
            console.log(err);
        })
    }

    swapPage () {
        this.setState({showLoginPage: !this.state.showLoginPage});
    }

    componentDidMount(){}

    render(){
        var formContents = (<div>
            <div class="modal-header">
                <h5 class="modal-title text-center" id="exampleModalLabel">Login</h5>
            </div>
            <div class="modal-body">
                <form onSubmit={this.login}>
                    <LoginForm getData = {this.loginDataCB} passwordClass = {this.state.passwordClass} />
                    <button type="submit" class="btn btn-primary btn-block">LOGIN</button>
                    <button type="button" class="btn btn-outline-secondary btn-block" onClick={this.swapPage}>SIGN UP</button>
                </form>
            </div>
        </div>);
        if (!this.state.showLoginPage)
            formContents = <div>
                <div class="modal-header">
                    <h5 class="modal-title text-center" id="exampleModalLabel">Sign Up</h5>
                </div>
                <div class="modal-body">
                    <form onSubmit={this.signup}>
                        <SignupForm getData = {this.signupDataCB} />
                        <button type="submit" class="btn btn-primary btn-block">SIGN UP</button>
                        <button type="button" class="btn btn-outline-secondary btn-block" onClick={this.swapPage}>LOGIN</button>
                    </form>
                </div>
            </div>
        return (<div class="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    {formContents}
                </div>
            </div>
        </div>);
    }

}

export default withRouter(Login);