import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainMenu, MainMenuItem } from './components/MainMenu/MainMenu';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import CustomerService from './components/CustomerService/CustomerService';
import CustomFurniture from './components/CustomFurniture/CustomFurniture';

const menuItems = [
  new MainMenuItem("Home", "/"),
  new MainMenuItem("Contact", "/contact/"),
  new MainMenuItem("Customer service", "/service/"),
  new MainMenuItem("Custom furniture", "/custom/")
];

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items= { menuItems }></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage }/>
        <Route path="/contact" component={ ContactPage }/>
        <Route path="/service" component={ CustomerService }/>
        <Route path="/custom" component={ CustomFurniture }/>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
