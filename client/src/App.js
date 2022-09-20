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
import About from './pages/About/About.js';
import Contact from './pages/Contact/Contact.js';
import New from './pages/New/New.js';
import Browse from './pages/Browse/Browse.js';
import Popular from './pages/Popular/Popular.js';

class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      token: null,
      user: null,
      loginPrompted: false
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
    fetch(process.env.REACT_APP_API+"users/self", {
      method: 'GET',
      headers: {'token': token}
    })
    .then(res => res.json())
    .then(self => {
      console.log(self);
      this.setState({token: token, user: self});
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
    console.log(this.state.user);
    return (<div id="app-main" class="min-vh-100 d-flex flex-column bg-main">
      <BrowserRouter>
        <Header search={() => {this.forceUpdate()}} token={this.state.token} setToken={this.setToken} deleteToken={this.deleteToken} user={this.state.user}
          isLoginPrompted={this.state.loginPrompted} loginPrompted={() => {this.setState({loginPrompted: false})}} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/search" component={Search} token={this.state.token} />
          <Route path="/title/:id" render={(props) => <Title {...props} token={this.state.token} user={this.state.user} 
            promptLogin={() => {this.setState({loginPrompted: true})}}/>} />
          <Route path="/about" component={About}/>
          <Route path="/contact" component={Contact}/>
          <Route path="/browse" component={Browse}/>
          <Route path="/new" component={New}/>
          <Route path="/popular" component={Popular}/>
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
