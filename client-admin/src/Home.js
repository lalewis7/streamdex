import React from 'react';

import Header from './Header.js';

class Home extends React.Component {

    render(){
        return <>
            <Header setToken={this.props.setToken} deleteToken={this.props.deleteToken} token={this.props.token}/>
            <div class="container">
                <div class="row">
                    <div class="col text-center mt-5">
                        <h1>Admin Panel</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center mt-3">
                        <a class="btn btn-outline-light" href="/users">
                            View Users
                        </a>
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center mt-3">
                        <a class="btn btn-outline-light" href="/titles">
                            View Titles
                        </a>
                    </div>
                </div>
            </div>
        </>;
    }

}

export default Home;