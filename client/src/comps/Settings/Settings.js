import React from 'react';
import './Settings.css';

import StreamSettings from '../StreamSettings/StreamSettings.js';
import LoginSettings from '../LoginSettings/LoginSettings.js';
import SignupSettings from '../SignupSettings/SignupSettings.js';

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
        return <div class="container-fluid p-0">
            <div class="row mb-3">
                <div class="col d-flex flex-row justify-content-between align-items-center">
                    {/* <div class="d-flex flex-row align-items-center">
                        
                    </div> */}
                    <button class="btn rounded-circle p-1 btn-close-white" onClick={() => {this.setState({focus: null})}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                            </svg>
                        </button>
                        <h3 class="ps-2">{title}</h3>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            {content}
        </div>
    }

    switchPage(page){
        this.setState({focus: page});
    }

    getGotoPage(text, clicked){
        return <div class="row my-3">
            <div class="col d-grid">
                <button class="btn rounded-pill p-3 d-flex flex-row justify-content-between align-items-center settings-select-2 shadow-none text-head" onClick={clicked}>
                    <h6 class="m-0 mx-2">{text}</h6>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" class="bi bi-arrow-right-short mx-2 text-head1" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>
                </button>
            </div>
        </div>
    }

    getContent(){
        console.log(this.state.focus);
        if (this.state.focus === 'streams'){
            return this.getPageWrapper('Streams', <StreamSettings />);
        } 
        else if (this.state.focus === 'login'){
            return this.getPageWrapper('LOGIN', <LoginSettings switchPage={this.switchPage}/>);
        }
        else if (this.state.focus === 'signup'){
            return this.getPageWrapper('SIGN UP', <SignupSettings switchPage={this.switchPage}/>);
        }
        return <div class="container-fluid">
            <div class="row mb-3">
                <div class="col d-flex flex-row justify-content-between align-items-center">
                    <div class="text-head d-flex flex-row align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                        </svg>
                        <h2 class="ps-2 m-0 text-head">Settings</h2>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            {this.getGotoPage('Login', () => {this.switchPage('login')})}
            {this.getGotoPage('Sign Up', () => {this.switchPage('signup')})}
            {this.getGotoPage('Streams', () => {this.switchPage('streams')})}
            {/* <div class="row my-3">
                <div class="col d-grid">
                    <button class="btn rounded-pill p-3 d-flex flex-row justify-content-between align-items-center settings-select-2 shadow-none" onClick={() => {this.switchPage('login')}}>
                        <h6 class="text-head1 m-0 mx-2">Login</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" class="bi bi-arrow-right-short mx-2 text-head1" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="row my-3">
                <div class="col d-grid">
                    <button class="btn rounded-pill p-3 d-flex flex-row justify-content-between align-items-center settings-select-2 shadow-none" onClick={() => {this.switchPage('signup')}}>
                        <h6 class="text-head1 m-0 mx-2">Sign Up</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" class="bi bi-arrow-right-short mx-2 text-head1" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="row my-3">
                <div class="col d-grid">
                    <button class="btn rounded-pill p-3 d-flex flex-row justify-content-between align-items-center settings-select-2 shadow-none" onClick={() => {this.switchPage('streams')}}>
                        <h6 class="text-head1 m-0 mx-2">Streams</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" class="bi bi-arrow-right-short mx-2 text-head1" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </button>
                </div>
            </div> */}
        </div>
    }

    render(){
        return <div class="modal fade" id="settings-modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-main">
                    <div class="modal-body">
                        {this.getContent()}
                    </div>
                </div>
            </div>
        </div>
    }

}

export default Settings;