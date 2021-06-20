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
import Home from './pages/Home.js';
import Discover from './pages/Discover.js';
import NotFound from './pages/NotFound.js';
import Search from './pages/Search.js';
import Nav from './pages/Nav.js';
import Title from './pages/TitlePage.js';
import Login from './comps/Login.js';
import Settings from './comps/Settings.js';
import Profile from './pages/Profile.js';
import Streams from './pages/Streams.js';

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
    return (<div class="vh-100 d-flex flex-column">
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
