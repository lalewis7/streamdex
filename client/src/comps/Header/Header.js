import React from 'react';
import { withRouter } from "react-router-dom";
import "./Header.css";

import Settings from '../Settings/Settings.js';

const Storage = require('../../util/storage.js');
const SVG = require('../../util/svg.js');

const queryString = require('query-string');

class Header extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            query: "",
            showSettings: false
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
        this.props.search(this.state.query);
    }

    logout (evt) {
        Storage.removeToken();
    }

    render(){
        return <>
            <Settings show={this.state.showSettings} setVisible={(val) => {this.setState({showSettings: val})}} setToken={this.props.setToken} 
                deleteToken={this.props.deleteToken} token={this.props.token} user={this.props.user} isLoginPrompted={this.props.isLoginPrompted} 
                loginPrompted={() => {this.setState({showSettings: true});this.props.loginPrompted();}} />
            <div class="navbar-top-padding">
                <nav class="navbar navbar-dark navbar-expand-sm fixed-top bg-dark">
                    <div class="container-md">
                        <a class="navbar-brand" href="/">
                            <img src="/streamdex-icon.svg" width="32" height="32" class="d-inline-block align-text-top"/>
                            <span class="ps-2">
                            Streamdex
                            </span>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerCollapseContent" aria-controls="headerCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse">
                            <ul class="navbar-nav me-auto mb-0">
                                <li class="nav-item">
                                    <a href="/browse" class={window.location.pathname.toLowerCase() === '/browse' ? "nav-link active" : "nav-link"}>Browse</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/new" class={window.location.pathname.toLowerCase() === '/new' ? "nav-link active" : "nav-link"}>New</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/popular" class={window.location.pathname.toLowerCase() === '/popular' ? "nav-link active" : "nav-link"}>Popular</a>
                                </li>
                            </ul>
                            <div class="d-flex w-100">
                                <form class="form-inline input-group px-2" onSubmit={this.search}>
                                    <input id="header-searchbar" class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                    <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                        <SVG.Search w={'1em'} h={'1em'} />
                                    </button>
                                </form>
                                <button class="p-1 ps-3 pe-2 nav-link btn dropdown-toggle d-flex align-items-center shadow-none" onClick={() => {this.setState({showSettings: true})}}>
                                    <SVG.SettingsGear w={'1.4em'} h={'1.4em'} />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="collapse navbar-dark text-light p-2 fixed-top bg-dark header-mobile d-sm-none" id="headerCollapseContent" >
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row">
                            <ul class="navbar-nav mb-2 flex-row justify-content-evenly w-100">
                                <li class="nav-item">
                                    <a href="/browse" class={window.location.pathname.toLowerCase() === '/browse' ? "nav-link active" : "nav-link"}>Browse</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/new" class={window.location.pathname.toLowerCase() === '/new' ? "nav-link active" : "nav-link"}>New</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/popular" class={window.location.pathname.toLowerCase() === '/popular' ? "nav-link active" : "nav-link"}>Popular</a>
                                </li>
                            </ul>
                        </div>
                        <div class="d-flex flex-row">
                            <form class="form-inline input-group" onSubmit={this.search}>
                                <input class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                    <SVG.Search w={'1.25em'} h={'1.25em'} />
                                </button>
                            </form>
                            <button class="btn p-2 mx-2 nav-link d-flex align-items-center shadow-none" onClick={() => {this.setState({showSettings: true})}}>
                                <SVG.SettingsGear w={'1.65em'} h={'1.65em'} />
                            </button>
                        </div>
                    </div>
                </div>
           </div>
           </>
    }
}

export default withRouter(Header);