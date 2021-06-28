import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

// components
import Header from './comps/Header/Header.js';
import LoginSignup from './comps/LoginSignup/LoginSignup.js';

// pages
import Home from './pages/Home/Home.js';
import Discover from './pages/Discover/Discover.js';
import NotFound from './pages/NotFound/NotFound.js';
import Search from './pages/Search/Search.js';
import Title from './pages/Title/Title.js';
import Settings from './pages/Settings/Settings.js';
import Test from './pages/Test/Test.js';

class App extends React.Component{

  render(){
    return (<div id="app-main" class="min-vh-100 d-flex flex-column bg-main">
      <BrowserRouter>
        <Header />
        <LoginSignup />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/search" component={Search} />
          <Route path="/title/:id" component={Title} />
          <Route path="/settings" component={Settings} />
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
