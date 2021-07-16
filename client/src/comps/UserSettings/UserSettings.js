import React from 'react';

var Validate = require('../../util/validate.js');
var Config = require('../../util/config.js');
var Storage = require('../../util/storage.js');
const SVG = require('../../util/svg.js');

class UserSettings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            currentPassword: "",
            newPassword: "",
            newPasswordConf: "",

            usernameClass: "",
            usernameInvalid: "",
            emailClass: "",
            newPasswordClass: "",
            newPasswordConfClass: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.usernameValidate = this.usernameValidate.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.emailValidate = this.emailValidate.bind(this);
        this.currentPasswordChange = this.currentPasswordChange.bind(this);
        this.newPasswordChange = this.newPasswordChange.bind(this);
        this.newPasswordValidate = this.newPasswordValidate.bind(this);
        this.newPasswordConfChange = this.newPasswordConfChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    usernameChange (evt) {
        this.setState({username: evt.target.value});
        if (Validate.username(evt.target.value))
            this.setState({usernameClass: "is-valid"});
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

    usernameValidate (evt) {
        if (!Validate.username(evt.target.value))
            this.setState({usernameClass: "is-invalid", usernameInvalid: "Username must be 4-32 characters long and only contain letters and digits."});
    }

    emailChange (evt) {
        this.setState({email: evt.target.value});
        if (evt.target.value === "")
            this.setState({emailClass: ""});
        else if (Validate.email(evt.target.value))
            this.setState({emailClass: "is-valid"});
        else
            this.setState({emailClass: "is-invalid"});
    }

    emailValidate (evt) {
        if (!Validate.email(evt.target.value) && evt.target.value !== "")
            this.setState({emailClass: "is-invalid"});
    }

    currentPasswordChange(evt){
        this.setState({currentPassword: evt.target.value});
    }

    newPasswordChange(evt) {
        this.setState({newPassword: evt.target.value});
        if (Validate.password(evt.target.value))
            this.setState({newPasswordClass: "is-valid"})
        if (!Validate.password(evt.target.value))
            this.setState({newPasswordClass: "is-invalid"});
    }

    newPasswordValidate(evt){
        if (!Validate.password(evt.target.value))
            this.setState({newPasswordClass: "is-invalid"});
    }

    newPasswordConfChange(evt){
        this.setState({newPasswordConf: evt.target.value});
        if (this.state.newPassword !== evt.target.value && evt.target.value.length >= this.state.newPassword.length)
            this.setState({newPasswordConfClass: "is-invalid"});
        else if (this.state.newPassword === "")
            this.setState({newPasswordConfClass: ""});
        else if (this.state.newPassword === evt.target.value)
            this.setState({newPasswordConfClass: "is-valid"});
    }

    submit(){
        if (this.state.oldPassword || this.state.newPassword || this.state.newPasswordConf){

        }
        fetch(Config.API+"users/"+this.props.user.id, 
        {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({handle: this.state.username, email: this.state.email, 
                password: this.state.password})
        })
    }

    componentDidMount(){
        if (this.props.user && !this.state.username && !this.state.email)
            this.setState({username: this.props.user.handle, email: this.props.user.email});
    }

    componentDidUpdate(){
        if (this.props.user && !this.state.username && !this.state.email)
            this.setState({username: this.props.user.handle, email: this.props.user.email});
    }

    render(){
        return <>
            <div class="row">
                <div class="col pe-3">
                    <form >
                        <h4>User Information</h4>
                        <div class="mb-3">
                            <label for="accUsername" class="form-label">Username</label>
                            <input type="text" class={"form-control "+this.state.usernameClass} id="accUsername" placeholder="Username" value={this.state.username} onChange={this.usernameChange} onBlur={this.usernameValidate}/>
                            <div class="invalid-feedback">{this.state.usernameInvalid}</div>
                        </div>
                        <div class="mb-3">
                            <label for="accEmail" class="form-label">Email</label>
                            <input type="email" class={"form-control "+this.state.emailClass} id="accEmail" placeholder="Email" value={this.state.email} onChange={this.emailChange} onBlur={this.emailValidate}/>
                            <div class="invalid-feedback">Email invalid.</div>
                        </div>
                        <hr/>
                        <h4>Change Password</h4>
                        <div class="mb-3">
                            <label for="accCurentPassword" class="form-label">Current Password</label>
                            <input type="password" class="form-control " id="accCurentPassword" placeholder="Current Password" value={this.state.currentPassword} onChange={this.currentPasswordChange} />
                            <small id="passwordHelpBlock" class="form-text text-muted">
                                Your current password is required to change your password.
                            </small>
                        </div>
                        <div class="mb-3">
                            <label for="accPassword" class="form-label">New Password</label>
                            <input type="password" class={"form-control "+this.state.newPasswordClass} id="accPassword" placeholder="New Password" value={this.state.newPassword} onChange={this.newPasswordChange} onBlur={this.newPasswordValidate}/>
                            <div class="invalid-feedback">Password must be 8-64 characters long.</div>
                        </div>
                        <div class="mb-3">
                            <label for="accPasswordConfirm" class="form-label">Confirm Password</label>
                            <input type="password" class={"form-control "+this.state.newPasswordConfClass} id="accPasswordConfirm" placeholder="Confirm Password" value={this.state.newPasswordConf} onChange={this.newPasswordConfChange} />
                            <div class="invalid-feedback">Passwords do not match.</div>
                        </div>
                        <div class="w-100 d-flex flex-row justify-content-end">
                            <button type="submit" class="btn btn-primary float-right" >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    }

}

export default UserSettings;