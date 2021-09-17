import React from 'react';

const Config = require('../../util/config.js');
const SVG = require('../../util/svg.js');

class LoginSettings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // form data
            user: '',
            password: '',
            passwordClass: '',
            loading: false,
        };
        // bind this
        this.handleChange = this.handleChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    passwordChange (evt) {
        this.setState({password: evt.target.value, passwordClass: ""});
    }

    /**
     * Login attempt (pressed login btn)
     * @param {Object} evt 
     */
     login (evt) {
        this.setState({loading: true});
        // do not submit form
        evt.preventDefault();
        // attempt to get token
        fetch(Config.API+"auth",
        {
            method: 'GET',
            headers: {'user': this.state.user, 'password': this.state.password}
        })
        .then(res => {
            // successful credentials
            if (res.ok){
                return res.text().then(token => {
                    // save token
                    this.props.setToken(token);
                    // remove login page
                    this.props.setVisible(false);
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
        .finally(() => {
            this.setState({loading: false});
        })
    }

    render(){
        let loginBtn = <button type="submit" class="btn btn-primary">LOGIN</button>;
        if (this.state.loading)
            loginBtn = <>
                <button type="submit" class="btn btn-primary" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                    </span>
                    <span class="visually-hidden">Loading...</span>
                </button>
            </>
        return  <form onSubmit={this.login}>
                    <div class="row my-3">
                        <div class="col-12">
                            <div class="input-group">
                                <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                                    <SVG.UserFill w={'1.15em'} h={'1.15em'} />
                                </span>
                                <input type="text" class="form-control border-0 bg-highlight text-head text-input" id="loginUsername" placeholder="Username" value={this.state.user} name="user" onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col-12">
                            <div class="input-group has-validation">
                                <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                                    <SVG.PasswordFill w={'1.15em'} h={'1.15em'} />
                                </span>
                                <input type="password" class={"form-control border-0 bg-highlight text-head text-input "+this.state.passwordClass} id="loginPassword" placeholder="Password" value={this.state.password} name="loginPassword" onChange={this.passwordChange} />
                                <div class="invalid-feedback">Username or password incorrect. Please try again.</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 d-grid">
                            {loginBtn}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <p class="text-center mt-3 text-main">
                            Not a member?
                            <a href="javacript:void(0);" class="link-light ms-1" onClick={() => {this.props.switchPage('signup')}}>Sign up now</a>
                            </p>
                        </div>
                    </div>
                </form>
    }

}

export default LoginSettings;