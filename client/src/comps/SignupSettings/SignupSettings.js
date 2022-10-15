import React from 'react';

const validate = require('../../util/validate.js');
const SVG = require('../../util/svg.js');

class SignupSettings extends React.Component {

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

            loading: false,
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
        this.signup = this.signup.bind(this);
    }

    /**
     * called from onChange and changes any input in the component state with name = value
     * @param {Object} evt 
     */
    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    /**
     * Handles changes to username input
     * Checks if username is already taken
     * @param {Object} evt 
     */
    usernameChange (evt) {
        // set value
        this.setState({username: evt.target.value});
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
        this.setState({email: evt.target.value});
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
        this.setState({password: evt.target.value});
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
        if (!validate.password(evt.target.value))
            this.setState({passwordClass: "is-invalid"});
    }

    /**
     * Handles changes to confirm password change
     * @param {Object} evt 
     */
    passwordConfirmChange(evt){
        // set value
        this.setState({passwordConfirm: evt.target.value});
        // only set to not valid if value is more or equal characters
        if (this.state.password !== evt.target.value && evt.target.value.length >= this.state.password.length)
            this.setState({passwordConfirmClass: "is-invalid"});
        else if (this.state.password === "")
            this.setState({passwordConfirmClass: ""});
        else if (this.state.password === evt.target.value)
            this.setState({passwordConfirmClass: "is-valid"});
    }

    /**
     * Signup attempt for user
     * @param {Object} evt 
     */
     signup (evt) {
        this.setState({loading: true});

        evt.preventDefault();
        // send post to create user
        fetch(process.env.REACT_APP_API+"users", 
        {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({handle: this.state.username, email: this.state.email, 
                password: this.state.password})
        })
        .then(res => {
            // successfully created user
            if (res.ok)
                // get token for newly created user
                return fetch(process.env.REACT_APP_API+"auth",
                {
                    method: "GET",
                    headers: {'user': this.state.username, 'password': this.state.password}
                })
                .then(res => {
                    if (res.ok){
                        return res.text().then(token => {
                            this.props.setToken(token);
                            // remove login page
                            this.props.setVisible(false);
                        });
                    } else {
                        console.log('Failed to login after signup');
                    }
                },
                err => {
                    console.log(err);
                });
        }, err => {
            console.log(err);
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    render(){
        let signupBtn = <button type="submit" class="btn btn-primary">SIGN UP</button>;
        if (this.state.loading)
            signupBtn = <>
                <button type="submit" class="btn btn-primary">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="visually-hidden">Loading...</span>
                </button>
            </>
        return <form onSubmit={this.signup}>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.UserFill w={'1.15em'} h={'1.15em'}/>
                        </span>
                        <input type="text" class={"form-control border-0 bg-highlight text-head text-input "+this.state.usernameClass} id="signupUsername" placeholder="Username" value={this.state.username} onChange={this.usernameChange} onBlur={this.usernameValidate}/>
                        <div class="invalid-feedback">{this.state.usernameInvalid}</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.EmailFill w={'1.15em'} h={'1.15em'} />
                        </span>
                        <input type="email" class={"form-control border-0 bg-highlight text-head text-input "+this.state.emailClass} id="signupEmail" placeholder="Email" value={this.state.email} onChange={this.emailChange} onBlur={this.emailValidate}/>
                        <div class="invalid-feedback">Email invalid.</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.PasswordFill w={'1.15em'} h={'1.15em'} />
                        </span>
                        <input type="password" class={"form-control border-0 bg-highlight text-head text-input "+this.state.passwordClass} id="signupPassword" placeholder="Password" value={this.state.password} onChange={this.passwordChange} onBlur={this.passwordValidate}/>
                        <div class="invalid-feedback">Password must be 8-64 characters long.</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.PasswordFill w={'1.15em'} h={'1.15em'} />
                        </span>
                        <input type="password" class={"form-control border-0 bg-highlight text-head text-input "+this.state.passwordConfirmClass} id="signupPasswordConfirm" placeholder="Confirm Password" value={this.state.passwordConfirm} onChange={this.passwordConfirmChange} />
                        <div class="invalid-feedback">Passwords do not match.</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid">
                    {signupBtn}
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="text-center mt-3 text-main">
                    Already a member?
                    <a href="javacript:void(0);" class="link-light ms-1" onClick={() => {this.props.switchPage('login')}}>Login now</a>
                    </p>
                </div>
            </div>
        </form>
    }

}

export default SignupSettings;