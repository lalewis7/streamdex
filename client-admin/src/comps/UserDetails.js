import React from 'react';
import isEqual from 'lodash/isEqual';

const SVG = require('../svg.js');
const validate = require('../validate.js');

class UserDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // form data
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',

            // valid
            usernameTaken: null,
            usernameShowValid: false,
            emailShowValid: false,
            passwordShowValid: false,
            passwordConfirmShowValid: false,

            // invalid messages
            usernameInvalidMsg: ''
        };

        // bind this
        this.handleChange = this.handleChange.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.isUsernameValid = this.isUsernameValid.bind(this);
        this.validateUsername = this.validateUsername.bind(this);

        this.emailChange = this.emailChange.bind(this);
        this.isEmailValid = this.isEmailValid.bind(this);
        this.validateEmail = this.validateEmail.bind(this);

        this.passwordChange = this.passwordChange.bind(this);
        this.isPasswordValid = this.isPasswordValid.bind(this);
        this.validatePassword = this.validatePassword.bind(this);

        this.passwordConfirmChange = this.passwordConfirmChange.bind(this);
        this.isPasswordConfirmValid = this.isPasswordConfirmValid.bind(this);
        this.validatePasswordConfirm = this.validatePasswordConfirm.bind(this);

        this.resetForms = this.resetForms.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
    }

    componentDidMount() {
        if (this.props.user)
            this.setState({
                username: this.props.user.handle,
                email: this.props.user.email
            })
    }

    componentDidUpdate(prevProps, prevState){
        if (!isEqual(this.state, prevState))
            this.updateDetails();
        if (!isEqual(this.props.user, prevProps.user) || (this.props.show != prevProps.show && this.props.show))
            this.resetForms();
        if (prevProps.submitted != this.props.submitted && this.props.submitted){
            this.validateUsername();
            this.validateEmail();
            this.validatePassword();
            if (!this.isPasswordConfirmValid())
                this.validatePasswordConfirm();
        }
    }

    updateDetails(){
        this.props.updateUser({
            username: this.state.username,
            usernameValid: this.isUsernameValid(),
            email: this.state.email,
            emailValid: this.isEmailValid(),
            password: this.state.password,
            passwordValid: this.isPasswordValid(),
            passwordConfirm: this.state.passwordConfirm,
            passwordConfirmValid: this.isPasswordConfirmValid(),
        });
    }

    resetForms(){
        if (this.props.user)
            this.setState({
                // form data
                username: this.props.user.handle ? this.props.user.handle : '',
                email: this.props.user.email ? this.props.user.email : '',
                password: '',
                passwordConfirm: '',

                // valid
                usernameTaken: null,
                usernameShowValid: false,
                emailShowValid: false,
                passwordShowValid: false,
                passwordConfirmShowValid: false,

                // invalid messages
                usernameInvalidMsg: ''
            });
        else
            this.setState({
                // form data
                username: '',
                email: '',
                password: '',
                passwordConfirm: '',

                // valid
                usernameTaken: null,
                usernameShowValid: false,
                emailShowValid: false,
                passwordShowValid: false,
                passwordConfirmShowValid: false,

                // invalid messages
                usernameInvalidMsg: ''
            });
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    usernameChange (evt) {
        let name = evt.target.value;
        this.setState({username: name});
        if (validate.username(name))
            this.setState({usernameValid: true});
        // check if username is available
        if (name !== '')
            fetch(process.env.REACT_APP_API+"handle/"+name)
                .then(res => {
                    if (res.status == 200 && validate.username(name) && this.state.username === name)
                        this.setState({usernameShowValid: true});
                    else if (res.status == 200 && !validate.username(name) && this.state.username === name)
                        this.setState({usernameShowValid: false});
                    if (res.status != 200)
                        this.setState({usernameShowValid: true, usernameTaken: name, usernameInvalidMsg: "Username already taken."});
                }, 
                err => {
                    console.log(err);
                });
    }

    isUsernameValid(state = this.state){
        return validate.username(state.username) && state.username !== state.usernameTaken;
    }

    validateUsername(){
        if (this.isUsernameValid())
            this.setState({usernameShowValid: true});
        else if (this.state.username !== this.state.usernameTaken)
            this.setState({usernameShowValid: true, usernameInvalidMsg: "Username must be 4-32 characters long and only contain letters and digits."});
    }

    emailChange (evt) {
        this.setState({email: evt.target.value});
        if (evt.target.value === "")
            this.setState({emailShowValid: false});
        if (validate.email(evt.target.value))
            this.setState({emailShowValid: true});
    }

    isEmailValid(state = this.state){
        return validate.email(state.email);
    }

    validateEmail(){
        this.setState({emailShowValid: true});
    }

    passwordChange(evt){
        this.setState({password: evt.target.value});
        if (validate.password(evt.target.value))
            this.setState({passwordShowValid: true});
    }

    isPasswordValid(state = this.state){
        return validate.password(state.password);
    }

    validatePassword(){
        this.setState({passwordShowValid: true});
    }

    passwordConfirmChange(evt){
        this.setState({passwordConfirm: evt.target.value});
        if (this.state.password === evt.target.value)
            this.setState({passwordConfirmShowValid: true});
    }

    isPasswordConfirmValid(state = this.state){
        return state.password === state.passwordConfirm;
    }

    validatePasswordConfirm(){
        this.setState({passwordConfirmShowValid: true});
    }

    render(){

        const inputClass = (valid, show) => {
            if (!show)
                return "form-control border-0 bg-highlight text-head text-input";
            else
                if (valid)
                    return "form-control border-0 bg-highlight text-head text-input is-valid";
                else
                    return "form-control border-0 bg-highlight text-head text-input is-invalid";
        }

        return <>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.UserFill w={'1.15em'} h={'1.15em'}/>
                        </span>
                        <input type="text" class={inputClass(this.isUsernameValid(), this.state.usernameShowValid)} placeholder="Username" value={this.state.username} onChange={this.usernameChange} onBlur={this.validateUsername}/>
                        <div class="invalid-feedback">{this.state.usernameInvalidMsg}</div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group has-validation">
                        <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                            <SVG.EmailFill w={'1.15em'} h={'1.15em'} />
                        </span>
                        <input type="email" class={inputClass(this.isEmailValid(), this.state.emailShowValid)} placeholder="Email" value={this.state.email} onChange={this.emailChange} onBlur={this.validateEmail}/>
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
                        <input type="password" class={inputClass(this.isPasswordValid(), this.state.passwordShowValid)} placeholder="Password" value={this.state.password} onChange={this.passwordChange} onBlur={this.validatePassword}/>
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
                        <input type="password" class={inputClass(this.isPasswordConfirmValid(), this.state.passwordConfirmShowValid)} placeholder="Confirm Password" value={this.state.passwordConfirm} onChange={this.passwordConfirmChange} onBlur={this.validatePasswordConfirm} />
                        <div class="invalid-feedback">Passwords do not match.</div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default UserDetails;