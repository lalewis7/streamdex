import React from 'react';
import isEqual from 'lodash/isEqual';

import Modal from '../Modal.js';
import Loading from '../Loading.js';
import UserDetails from './UserDetails.js';
import TextArray from '../TextArray.js';

const SVG = require('../svg.js');
const Config = require('../config.json');
const validate = require('../validate.js');

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "loading",
            user: {},
            loading: false,
            admin: false,
            locked: false,
            streams: [],
            userDetails: {},

            responseMsgVisible: false,
            responseMsg: "",
            responseMsgError: true
        }
        this.streams = [];
        this.loadUser = this.loadUser.bind(this);
        this.resetFields = this.resetFields.bind(this);
        this.changesMade = this.changesMade.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck (evt) {
        this.setState({ [evt.target.name]: evt.target.checked ? true : false });
    }

    componentDidMount() {
        if (this.props.user && !this.state.user && this.state.status === "waiting")
            this.loadUser();
    }

    componentDidUpdate(prevProps) {
        if ((this.props.user && !this.state.user && this.state.status === "waiting") || prevProps.user !== this.props.user)
            this.loadUser();
        if (!this.props.show && this.props.show != prevProps.show){
            this.setState({responseMsgVisible: false});
            this.resetFields();
        }
    }

    loadUser(silent = false){
        if (this.props.user){
            if (!silent)
                this.setState({status: "loading"});
            fetch(Config.API+"users/"+this.props.user,
            {
                method: 'GET',
                headers: {'token': this.props.token}
            })
            .then(res => res.json())
            .then(user => {
                let stateChanges = {user: user, admin: user.admin, locked: user.locked};
                if (!silent)
                    stateChanges.status = 'loaded';
                this.setState(stateChanges, () => this.resetFields());
            })
            .catch(err => {
                if (!silent)
                    this.setState({status: "error"});
                console.log(err);
            });
        }
    }

    resetFields(){
        this.setState({
            id: this.state.user.id,
            admin: this.state.user.admin, 
            locked: this.state.user.locked
        });
    }

    changesMade(){
        return this.state.user && (this.state.userDetails.username !== this.state.user.handle || 
            this.state.userDetails.email !== this.state.user.email ||
            (this.state.userDetails.password !== '' && this.state.userDetails.passwordConfirm !== '') ||
            this.state.admin != this.state.user.admin || 
            this.state.locked != this.state.user.locked || 
            !isEqual(this.state.user.streams, this.state.streams));
    }

    saveChanges(evt){
        this.setState({loading: true, responseMsgVisible: false})
        evt.preventDefault();

        if (!this.state.userDetails.usernameValid || !this.state.userDetails.emailValid || (!this.state.userDetails.passwordValid && this.state.userDetails.password.length > 0) || !this.state.userDetails.passwordConfirmValid){
            this.setState({loading: false});
            return;
        }

        const body = {
            handle: this.state.userDetails.username,
            email: this.state.userDetails.email,
            admin: this.state.admin,
            locked: this.state.locked,
            streams: this.state.streams
        };
        if (this.state.userDetails.password)
            body.password = this.state.userDetails.password;
        
        fetch(Config.API+"users/"+this.state.id, 
        {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', 'token': this.props.token },
            body: JSON.stringify(body)
        })
        .then(res => {
            // successfully created user
            if (res.ok){
                this.props.loadUsers();
                this.loadUser(true);
                this.setState({responseMsgError: false, responseMsgVisible: true, responseMsg: "Changes saved."});
            }
            else {
                this.setState({responseMsgError: true, responseMsgVisible: true, responseMsg: "An error occured while saving changes."});
            }
        }, err => {
            this.setState({responseMsgError: true, responseMsgVisible: true, responseMsg: "An error occured while saving changes."});
            console.log(err);
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    render(){
        let saveChangesBtn = <button type="submit" class="btn btn-primary">Save Changes</button>

        if (!this.changesMade())
            saveChangesBtn = <button type="submit" class="btn btn-primary" disabled>Save Changes</button>
        
        if (this.state.loading)
            saveChangesBtn = <button type="submit" class="btn btn-primary" >
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>

        let responseMsgColor = "text-danger";
        if (!this.state.responseMsgError)
            responseMsgColor = "text-success";

        let footer = <></>;

        if (this.state.status === "loaded")
            footer = <>
                <div class="modal-footer">
                    <div class="w-100 d-flex flex-row justify-content-between">
                        <span class={responseMsgColor+" fs-6 align-self-center"}>{this.state.responseMsgVisible ? this.state.responseMsg : ''}</span>
                        {saveChangesBtn}
                    </div>
                </div>
            </>;

        return <>
            <form onSubmit={this.saveChanges}>
                <Modal show={this.props.show} id="user-view-modal" setVisible={this.props.setVisible}>
                    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-fullscreen-sm-down">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Edit User</h2>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <Loading status={this.state.status}>
                                    <div class="row my-3">
                                        <div class="col-12">
                                            <div class="input-group">
                                                <span class="input-group-text border-0 bg-highlight text-head2 shadow-none" >
                                                    <SVG.Id w={'1.15em'} h={'1.15em'}/>
                                                </span>
                                                <input type="text" disabled readOnly class={"form-control border-0 bg-highlight text-head text-input"} id="userId" placeholder="Username" value={this.state.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <UserDetails updateUser={user => this.setState({userDetails: user})} submitted={this.state.submitted} user={this.state.user && this.props.show ? this.state.user : {}}/>
                                    <div class="row my-3">
                                        <div class="col d-flex justify-content-center">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="userAdmin" name="admin" checked={this.state.admin} onChange={this.handleCheck} />
                                                <label class="form-check-label text-light" for="flexCheckDefault">
                                                    Admin
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col d-flex justify-content-center">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="userLocked" name="locked" checked={this.state.locked} onChange={this.handleCheck} />
                                                <label class="form-check-label text-light" for="flexCheckDefault">
                                                    Locked
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col">
                                            <h6>Streaming Services</h6>
                                        </div>
                                    </div>
                                    <TextArray values={this.state.user.streams} placeholder="amazon_prime, netflix, hulu..." updateValues={vals => this.setState({streams: vals})} show={this.props.show} />
                                </Loading>
                            </div>
                            {footer}
                        </div>
                    </div>
                </Modal>
            </form>
        </>;
    }

}

export default User;