import React from 'react';
import { withRouter } from "react-router-dom";
import "./Header.css";

import Settings from '../Settings/Settings.js';

const Storage = require('../../util/storage.js');

const queryString = require('query-string');

class Header extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            query: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount(){
        if (this.props.location.pathname.toLowerCase() == "/search")
            this.setState({query: queryString.parse(this.props.location.search).q});
    }

    // https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    search(evt){
        this.props.history.push("/search?q="+this.state.query);
        evt.preventDefault();
    }

    logout (evt) {
        Storage.removeToken();
    }

    render(){
        var accItem = <a class="dropdown-item" href="#" onClick={this.logout}>Logout</a>;
        console.log(this.props);
        if (!Storage.getToken()){
            accItem = <button type="button" class="dropdown-item dropdown-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                Sign Up / Login
            </button>;
        }
       return <>
            <Settings />
            <div id="header-main" class="bg-header">
                <nav class="navbar navbar-dark navbar-expand-sm">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">
                            <img src="/streamlogo.png" width="32" height="32" class="d-inline-block align-text-top"/>
                            <span class="text-logo ps-1">
                            streamdex
                            </span>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerCollapseContent" aria-controls="headerCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse">
                            <div class="d-flex justify-content-between w-100">
                                <form class="form-inline input-group w-50" onSubmit={this.search}>
                                    <input id="header-searchbar" class="form-control bg-highlight text-head border-0" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                    <button class="btn d-flex align-items-center border-0 bg-highlight text-head2 shadow-none" type="submit">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                        </svg>
                                    </button>
                                </form>
                                <ul class="navbar-nav">
                                        <button class="p-1 btn nav-link dropdown-toggle d-flex align-items-center shadow-none" data-bs-toggle="modal" data-bs-target="#settings-modal">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                            </svg>
                                        </button>
                                        {/* <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li><a class="dropdown-item" href="/account">Profile</a></li>
                                            <li><a class="dropdown-item" href="/streams">Settings</a></li>
                                            <li><div class="dropdown-divider"></div></li>
                                            <li>{accItem}</li>
                                        </ul> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="collapse navbar-dark text-light p-2" id="headerCollapseContent">
                    <form class="form-inline input-group" onSubmit={this.search}>
                        <input class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                        <button class="btn btn-outline-info d-flex align-items-center" type="submit">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                            </svg>
                        </button>
                    </form>
                    <a class="dropdown-item text-light text-center text-decoration-underline mt-2" href="/account">Profile</a>
                    <a class="dropdown-item text-light text-center text-decoration-underline mt-2" href="/streams">Settings</a>
                </div>
           </div>
           </>
    }
}

export default withRouter(Header);