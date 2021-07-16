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
                deleteToken={this.props.deleteToken} token={this.props.token} user={this.props.user} />
            <div>
                <nav class="navbar navbar-dark navbar-expand-sm">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">
                            <img src="/streamlogo.png" width="32" height="32" class="d-inline-block align-text-top"/>
                            <span class="ps-1">
                            streamdex
                            </span>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerCollapseContent" aria-controls="headerCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse">
                            <div class="d-flex justify-content-between w-100">
                                <form class="form-inline input-group w-50" onSubmit={this.search}>
                                    <input id="header-searchbar" class="form-control" type="search" placeholder="Search" aria-label="Search" name="query" value={this.state.query} onChange={this.handleChange} />
                                    <button class="btn btn-secondary d-flex align-items-center" type="submit">
                                        <SVG.Search w={'1em'} h={'1em'} />
                                    </button>
                                </form>
                                <ul class="navbar-nav">
                                    <button class="p-1 btn nav-link dropdown-toggle d-flex align-items-center shadow-none" onClick={() => {this.setState({showSettings: true})}}>
                                        <SVG.SettingsGear w={'1.4em'} h={'1.4em'} />
                                    </button>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="collapse navbar-dark text-light p-2" id="headerCollapseContent">
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
           </>
    }
}

export default withRouter(Header);