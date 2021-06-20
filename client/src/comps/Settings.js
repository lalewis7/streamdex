import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';

import Footer from '../comps/Footer.js';

class Settings extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        var accClass = "";
        if (window.location.pathname == "/account")
            accClass = "active";
        var strClass = "";
        if (window.location.pathname == "/streams")
            strClass = "active";
        return (
            <>
            <div class="container">
                <div class="card m-4 bg-light">
                    <h3 class="m-3">Settings</h3>
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class={"nav-link "+ accClass} href="/account">Account</a>
                        </li>
                        <li class="nav-item">
                            <a class={"nav-link " + strClass} href="/streams">Streaming Services</a>
                        </li>
                    </ul>
                    <div class="card-body">
                        {this.props.content}
                    </div>
                </div>
            </div>
            <Footer />
            </>
            );
    }

}

export default Settings;