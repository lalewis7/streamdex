import React from 'react';

const validate = require('../../util/validate.js');

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
        if (validate.username(evt.target.value))
            this.setState({usernameClass: "is-valid"});
        // check if username is available
        fetch(process.env.REACT_APP_API+"handle/"+evt.target.value)
        .then(res => {
            if (res.status == 200 && validate.username(evt.target.value))
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
        if (!validate.username(evt.target.value))
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
        if (validate.email(evt.target.value))
            this.setState({emailClass: "is-valid"});
    }

    /**
     * Checks if email is valid
     * @param {Object} evt 
     */
    emailValidate (evt) {
        if (!validate.email(evt.target.value) && evt.target.value !== "")
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
        if (validate.password(evt.target.value))
            this.setState({passwordClass: "is-valid"})
        if (!validate.password(evt.target.value))
            this.setState({passwordClass: "is-invalid"});
    }

    /**
     * Checks if password is valid
     * @param {Object} evt 
     */
    passwordValidate (evt) {
        console.log("here");
        if (!validate.password(evt.target.value))
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
        return <>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group">
                        <span class="input-group-text" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </span>
                        <input type="text" class={"form-control "+this.state.usernameClass} id="signupUsername" placeholder="Username" value={this.state.username} onChange={this.usernameChange} onBlur={this.usernameValidate}/>
                        <div class="invalid-feedback">{this.state.usernameInvalid}</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group">
                        <span class="input-group-text" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.15em" height="1.15em" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                            </svg>
                        </span>
                        <input type="email" class={"form-control "+this.state.emailClass} id="signupEmail" placeholder="Email" value={this.state.email} onChange={this.emailChange} onBlur={this.emailValidate}/>
                        <div class="invalid-feedback">Email invalid.</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group">
                        <span class="input-group-text" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.15em" height="1.15em" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                            </svg>
                        </span>
                        <input type="password" class={"form-control "+this.state.passwordClass} id="signupPassword" placeholder="Password" value={this.state.password} onChange={this.passwordChange} onBlur={this.passwordValidate}/>
                        <div class="invalid-feedback">Password must be 8-64 characters long.</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group">
                        <span class="input-group-text" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.15em" height="1.15em" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                            </svg>
                        </span>
                        <input type="password" class={"form-control "+this.state.passwordConfirmClass} id="signupPasswordConfirm" placeholder="Confirm Password" value={this.state.passwordConfirm} onChange={this.passwordConfirmChange} />
                        <div class="invalid-feedback">Passwords do not match.</div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default SignupForm;