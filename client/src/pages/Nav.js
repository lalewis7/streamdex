import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";

const Storage = require('../storage.js');

const queryString = require('query-string');

class Nav extends React.Component{

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
        // if searching change value of query
        console.log(queryString.parse(this.props.location.search).q);
        if (this.props.location.pathname.toLowerCase() == "/search")
            this.setState({query: queryString.parse(this.props.location.search).q});
    }

    // https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
    handleChange (evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    search(evt){
        console.log('search')
        this.props.history.push("/search?q="+this.state.query);
        evt.preventDefault();
    }

    logout (evt) {
        this.props.setToken(null);
    }

    render(){
        var accItem = <a class="dropdown-item" href="#" onClick={this.logout}>Logout</a>;
        console.log(this.props);
        if (!this.props.state.token || this.props.state.token == null){
            accItem = <button type="button" class="dropdown-item dropdown-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                Sign Up / Login
            </button>;
        }
        /*
        return (
            <nav class="navbar navbar-expand justify-content-between navbar-dark bg-dark">
                <a class="navbar-brand" href="/">Moviefinder.js</a>
                <form class="form-inline input-group w-50" onSubmit={this.search}>
                    <input class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                    <div class="input-group-append">
                        <button class="btn btn-outline-info d-flex align-items-center" type="submit">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                            </svg>
                        </button>
                    </div>
                </form>
                <div class="navbar-nav">
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <svg width="1.5em" height="1.35em" viewBox="0 0 16 16" class="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
                                <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
                            </svg>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/account">Profile</a>
                            <a class="dropdown-item" href="/streams">Settings</a>
                            <div class="dropdown-divider"></div>
                            {accItem}
                        </div>
                    </div>
                </div>
            </nav>
        );
        */
       return (
            <div>
                <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">Streamfinder</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerCollapseContent" aria-controls="headerCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse">
                            <div class="d-flex justify-content-between w-100">
                                <form class="form-inline input-group w-50" onSubmit={this.search}>
                                    <input class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                    <button class="btn btn-outline-light d-flex align-items-center" type="submit">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                        </svg>
                                    </button>
                                </form>
                                <ul class="navbar-nav">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <svg width="1.5em" height="1.35em" viewBox="0 0 16 16" class="bi bi-person-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
                                                <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                                <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
                                            </svg>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li><a class="dropdown-item" href="/account">Profile</a></li>
                                            <li><a class="dropdown-item" href="/streams">Settings</a></li>
                                            <li><div class="dropdown-divider"></div></li>
                                            <li>{accItem}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="collapse navbar-dark bg-dark text-light p-2" id="headerCollapseContent">
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
       );
    }
}

export default withRouter(Nav);