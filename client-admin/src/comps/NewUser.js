import React from 'react';

import Modal from '../Modal.js';
import UserDetails from './UserDetails.js';

class NewUser extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            submitted: false,
            user: {}
        };
        this.createNewUser = this.createNewUser.bind(this);
    }

    /**
     * Signup attempt for user
     * @param {Object} evt 
     */
     createNewUser (evt) {
        this.setState({loading: true, submitted: true});
        evt.preventDefault();

        if (!this.state.user.usernameValid || !this.state.user.emailValid || !this.state.user.passwordValid || !this.state.user.passwordConfirmValid){
            this.setState({loading: false});
            return;
        }

        // send post to create user
        fetch(process.env.REACT_APP_API+"users", 
        {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({handle: this.state.user.username, email: this.state.user.email, 
                password: this.state.user.password})
        })
        .then(res => {
            // successfully created user
            if (res.ok){
                this.props.setVisible(false);
                this.props.loadUsers();
            }
        }, err => {
            console.log(err);
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    componentDidUpdate(prevProps){
        if (this.props.show != prevProps.show && !this.props.show) {
            this.setState({submitted: false});
        }
    }

    render(){

        let createBtn = <button type="submit" class="btn btn-primary">Create New User</button>;
        if (this.state.loading)
            createBtn = <>
                    <button type="submit" class="btn btn-primary">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
                    </button>
                </>

        return <>
            <form onSubmit={this.createNewUser}>
                <Modal show={this.props.show} id="new-user-modal" setVisible={this.props.setVisible}>
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Create New User</h2>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <UserDetails updateUser={user => this.setState({user: user})} submitted={this.state.submitted} show={this.props.show} />
                            </div>
                            <div class="modal-footer">
                                {createBtn}
                            </div>
                        </div>
                    </div>
                </Modal>
            </form>
        </>;
    }

}

export default NewUser;