import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

// import bootstrap & jquery files
//import 'jquery/dist/jquery.min.js';
//window.$ = window.jQuery = require('jquery')
//import 'bootstrap';
//import 'bootstrap/dist/js/bootstrap.min.js';
//import 'bootstrap/dist/css/bootstrap.min.css';


const bootstrap = require('bootstrap');
console.log(bootstrap)


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
