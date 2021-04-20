import logo from './logo.svg';
import './App.css';

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

function App() {

  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Login update = {() => {this.forceUpdate().bind(this)}}/>
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
    </div>
  );
}

export default App;
