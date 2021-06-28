import React from 'react';
import { withRouter } from "react-router-dom";
import Config from '../../util/config.js';

import LoginForm from './LoginForm.js';
import SignupForm from './SignupForm.js';

const Storage = require('../../util/storage.js');

class LoginSignup extends React.Component {

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
                window.$('#loginModal').modal('hide');
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
                    window.$('#loginModal').modal('hide');
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
    
    render(){
        let content = {
            title: "LOGIN",
            buttonText: "LOGIN",
            onSubmit: this.login,
            form: <LoginForm getData = {this.loginDataCB} passwordClass = {this.state.passwordClass} />,
            switchPageText: "Sign up now",
            wrongPageText: "Not a member?"
        }
        if (!this.state.showLoginPage)
            content = {
                title: "SIGN UP",
                buttonText: "SIGN UP",
                onSubmit: this.signup,
                form: <SignupForm getData = {this.signupDataCB} />,
                switchPageText: "Login now",
                wrongPageText: "Already a member?"
            }
        return (<div class="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <form onSubmit={content.onSubmit}>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-12">
                                        <h3 class="text-center m-4 mt-1">{content.title}</h3>
                                    </div>
                                </div>
                                {content.form}
                                <div class="row">
                                    <div class="col-12 d-grid">
                                        <button type="submit" class="btn btn-primary">{content.buttonText}</button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <p class="text-center mt-3">
                                        {content.wrongPageText}
                                        <a href="javacript:void(0);" class="link-secondary ms-1" onClick={this.swapPage}>{content.switchPageText}</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }

}

export default withRouter(LoginSignup);