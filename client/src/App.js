import React from 'react';
import { withRouter } from "react-router-dom";
import {BrowserRouter, Switch, Route} from "react-router-dom";

// components
import Header from './comps/Header/Header.js';

// pages
import Home from './pages/Home/Home.js';
import Discover from './pages/Discover/Discover.js';
import NotFound from './pages/NotFound/NotFound.js';
import Search from './pages/Search/Search.js';
import Title from './pages/Title/Title.js';
import Test from './pages/Test/Test.js';

const Config = require('./util/config.js');

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      token: null,
      user: null
    }

    this.setToken = this.setToken.bind(this);
    this.deleteToken = this.deleteToken.bind(this);

  }

  componentDidMount(){
    if (sessionStorage.getItem('token'))
      this.setToken(sessionStorage.getItem('token'));
  }

  setToken(token){
    sessionStorage.setItem('token', token);
    // update self info
    fetch(Config.API+"users/self", {
      method: 'GET',
      headers: {'token': token}
    })
    .then(res => res.json())
    .then(self => {
      this.setState({token: token, user: self});
    });
  }

  deleteToken(){
    sessionStorage.removeItem('token');
    this.setState({token: null, user: null});
  }

  render(){
    return (<div id="app-main" class="min-vh-100 d-flex flex-column bg-main">
      <BrowserRouter>
        <Header search={() => {this.forceUpdate()}} token={this.state.token} setToken={this.setToken} deleteToken={this.deleteToken} user={this.state.user} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/search" component={Search} token={this.state.token} />
          <Route path="/title/:id" component={Title} token={this.state.token} />
          <Route path="/test" component={Test} />
          <Route render={() => <NotFound/>} />
        </Switch>
      </BrowserRouter>
    </div>);
  }

}

function AppExport() {

  return (
    <>
      <App />
    </>
  );
}

export default AppExport;
