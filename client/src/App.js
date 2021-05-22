import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

// import react router components
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";

// import all pages
import Home from './Home.js';
import Discover from './Discover.js';
import NotFound from './NotFound.js';
import Search from './Search.js';
import Nav from './Nav.js';
import Title from './Title.js';
import Login from './Login.js';
import Settings from './Settings.js';
import Profile from './Profile.js';
import Streams from './Streams.js';

class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      token: sessionStorage.getItem('token'),
      user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
    }

    this.setToken = this.setToken.bind(this);
    this.setUser = this.setUser.bind(this);

  }

  setToken(val) {
    if (val!=null)
      sessionStorage.setItem("token", val);
    else
      sessionStorage.removeItem("token");
    this.setState({token: val});
  }

  setUser(val){
    if (val!=null)
      sessionStorage.setItem("user", JSON.stringify(val));
    else
      sessionStorage.removeItem("user");
    this.setState({user: val});
  }

  render(){
    return (<div>
      <BrowserRouter>
        <Nav setToken={this.setToken} state = {{token: this.state.token, user: this.state.user}}/>
        <Login setToken={this.setToken} setUser={this.setUser} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/search" component={Search} />
          <Route path="/title/:id" component={Title} />
          <Route path="/account" component={Profile} />
          <Route path="/streams" component={Streams} />
          <Route render={() => <NotFound/>} />
        </Switch>
      </BrowserRouter>
    </div>);
  }

}

function AppExport() {

  return (
    <div>
      <App />
    </div>
  );
}

export default AppExport;
