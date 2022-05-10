import React from 'react';
import { withRouter } from "react-router";

const SVG = require('./svg.js');

class Header extends React.Component {

    componentDidMount() {
        if (!this.props.token)
            this.props.history.push("/login");
    }

    componentDidUpdate() {
        if (!this.props.token)
            this.props.history.push("/login");
    }

    render(){
        return <>
            <div class="navbar-top-padding">
                <nav class="navbar navbar-dark navbar-expand-sm fixed-top bg-dark">
                    <div class="container-md">
                        <a class="navbar-brand" href="/">
                            <img src="/streamlogo.svg" width="32" height="32" class="d-inline-block align-text-top"/>
                            <span class="ps-2">
                            Streamdex <span class="badge bg-light text-secondary fs-7">Administrator</span>
                            </span>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerCollapseContent" aria-controls="headerCollapseContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse">
                            <div class="d-flex justify-content-between w-100">
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <a class="nav-link" href="/users">Users</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/titles">Titles</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/images">Images</a>
                                    </li>
                                </ul>
                                <ul class="navbar-nav">
                                    <button class="p-1 btn nav-link d-flex align-items-center shadow-none" onClick={() => {this.props.deleteToken()}}>
                                        <SVG.Logout w={'1.4em'} h={'1.4em'} />
                                    </button>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="collapse navbar-dark text-light p-2 fixed-top bg-dark header-mobile d-sm-none" id="headerCollapseContent" >
                <div class="d-flex flex-column align-items-center">
                        <ul class="navbar-nav">
                            <li class="nav-item p-2">
                                <a class="nav-link" href="#">Users</a>
                            </li>
                            <li class="nav-item p-2">
                                <a class="nav-link" href="#">Titles</a>
                            </li>
                        </ul>
                        <button class="btn p-2 mx-2 nav-link d-flex align-items-center shadow-none">
                            <span class="pe-2">Logout</span><SVG.Logout w={'1.65em'} h={'1.65em'}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    }

}

export default withRouter(Header);