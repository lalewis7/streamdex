import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Home from './Home.js';
import TitleTable from './comps/TitleTable.js';
import UsersTable from './comps/UsersTable.js';
import ImagesTable from './comps/ImagesTable.js';
import NotFound from './NotFound.js';
import Login from './Login.js';

const Config = require('./config.json');

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      token: null
    }

    this.setToken = this.setToken.bind(this);
    this.deleteToken = this.deleteToken.bind(this);

    if (sessionStorage.getItem('token'))
      this.state.token = sessionStorage.getItem('token');

  }

  componentDidMount(){
    if (this.state.token)
      this.setToken(this.state.token);
  }

  setToken(token){
    sessionStorage.setItem('token', token);
    this.setState({token: token});
    // update self info
    fetch(Config.API+"users/self", {
      method: 'GET',
      headers: {'token': token}
    })
    .then(res => res.json())
    .then(self => {
      console.log(self);
      if (!self.admin)
        this.deleteToken();
    })
    .catch(err => {
      this.deleteToken();
    })
  }

  deleteToken(){
    sessionStorage.removeItem('token');
    this.setState({token: null, user: null});
  }

  render(){
    return (<div id="app-main" class="min-vh-100 d-flex flex-column bg-main">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} setToken={this.setToken} deleteToken={this.deleteToken} token={this.state.token} />} />
          <Route path="/login" render={(props) => <Login {...props} setToken={this.setToken} deleteToken={this.deleteToken} token={this.state.token} />} />
          <Route path={["/users/:id", "/users"]} render={(props) => <UsersTable {...props} setToken={this.setToken} deleteToken={this.deleteToken} token={this.state.token} />} />
          <Route path={["/titles/:id", "/titles"]} render={(props) => <TitleTable {...props} setToken={this.setToken} deleteToken={this.deleteToken} token={this.state.token} />} />
          <Route path={["/images/:id", "/images"]} render={(props) => <ImagesTable {...props} setToken={this.setToken} deleteToken={this.deleteToken} token={this.state.token} />} />
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
