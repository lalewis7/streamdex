import React from 'react';
//import './Settings.scss';

import StreamSettings from '../StreamSettings/StreamSettings.js';
import LoginSettings from '../LoginSettings/LoginSettings.js';
import SignupSettings from '../SignupSettings/SignupSettings.js';
import UserSettings from '../UserSettings/UserSettings.js';
import Modal from '../Modal/Modal.js';

const SVG = require('../../util/svg.js');

class Settings extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            focus: null
        }

        this.getContent = this.getContent.bind(this);
        this.getPageWrapper = this.getPageWrapper.bind(this);
        this.switchPage = this.switchPage.bind(this);
        this.getGotoPage = this.getGotoPage.bind(this);
    }

    componentDidMount(){
        document.getElementById('settings-modal').addEventListener('hidden.bs.modal', (event) => {
            this.setState({focus: null});
        });
    }

    getPageWrapper(title, content){
        return <>
            <div class="modal-header">
                <button class="btn rounded-circle p-1 settings-back" onClick={() => {this.setState({focus: null})}}>
                    <SVG.LeftArrowShort w={'2rem'} h={'2rem'} />
                </button>
                <h3>{title}</h3>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container-fluid p-0">
                    {content}
                </div>
            </div>
        </>
    }

    switchPage(page){
        this.setState({focus: page});
    }

    getGotoPage(text, clicked){
        return <div class="row my-3">
            <div class="col d-grid">
                <button class="btn rounded-pill p-3 d-flex flex-row justify-content-between align-items-center settings-select" onClick={clicked}>
                    <h4 class="m-0 mx-2">{text}</h4>
                    <SVG.RightArrowShort w={'1.5rem'} h={'1.5rem'} />
                </button>
            </div>
        </div>
    }

    getContent(){
        if (this.state.focus === 'streams'){
            return this.getPageWrapper('Streams', <StreamSettings />);
        } 
        else if (this.state.focus === 'login'){
            return this.getPageWrapper('LOGIN', <LoginSettings switchPage={this.switchPage} setToken={this.props.setToken} setVisible={this.props.setVisible} />);
        }
        else if (this.state.focus === 'signup'){
            return this.getPageWrapper('SIGN UP', <SignupSettings switchPage={this.switchPage} setToken={this.props.setToken} setVisible={this.props.setVisible} />);
        }
        else if (this.state.focus === 'usersettings'){
            return this.getPageWrapper('User Profile', <UserSettings switchPage={this.switchPage} user={this.props.user} />);
        }
        let options = [];
        if (this.props.token){
            options.push(this.getGotoPage('User Profile', () => {this.switchPage('usersettings')}));
            options.push(this.getGotoPage('Streams', () => {this.switchPage('streams')}));
            options.push(this.getGotoPage('Logout', () => {
                this.props.setVisible(false);
                this.props.deleteToken()
            }));
        }
        else {
            options.push(this.getGotoPage('Login', () => {this.switchPage('login')}));
            options.push(this.getGotoPage('Sign Up', () => {this.switchPage('signup')}));
            options.push(this.getGotoPage('Streams', () => {this.switchPage('streams')}));
        }
        return <>
            <div class="modal-header pb-0">
                <div class="text-head d-flex flex-row align-items-center">
                    <SVG.SettingsGear w={'1.75rem'} h={'1.75rem'} />
                    <h2 class="ps-2 m-0 text-head">Settings</h2>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {options.map(option => {return option})}
            </div>
        </>
    }

    render(){
        return <>
        <Modal id="settings-modal" show={this.props.show} setVisible={this.props.setVisible}>
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    {this.getContent()}
                </div>
            </div>
        </Modal>
        </>
    }

}

export default Settings;