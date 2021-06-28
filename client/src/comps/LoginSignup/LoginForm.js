import React from 'react';

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
        return <>
            <div class="row my-3">
                <div class="col-12">
                    <div class="input-group">
                        <span class="input-group-text" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.15em" height="1.15em" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                            </svg>
                        </span>
                        <input type="text" class="form-control" id="loginUsername" placeholder="Email" value={this.state.user} name="user" onChange={this.handleChange}/>
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
                        <input type="password" class={"form-control "+this.props.passwordClass} id="loginPassword" placeholder="Password" value={this.state.password} name="loginPassword" onChange={this.passwordChange} />
                        <div class="invalid-feedback">Username or password incorrect. Please try again.</div>
                    </div>
                </div>
            </div>
        </>
    }

}

export default LoginForm;