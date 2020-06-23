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
import { HashRouter, Switch, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import CustomerService from './components/CustomerService/CustomerService';
import CustomFurniture from './components/CustomFurniture/CustomFurniture';
import CategoryPage from './components/CategoryPage/CategoryPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorCategory from './components/AdministratorCategory/AdministratorCategory';
import AdministratorFeature from './components/AdministratorFeature/AdministratorFeature';
import AdministratorFurniture from './components/AdministratorFurniture/AdministratorFurniture';
import AdministratorPhoto from './components/AdministratorPhoto/AdministratorPhoto';
import FurniturePage from './components/FurniturePage/FurniturePage';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage }/>
        <Route path="/contact" component={ ContactPage }/>
        <Route path="/service" component={ CustomerService }/>
        <Route path="/custom" component={ CustomFurniture }/>
        <Route path="/category/:cId" component={ CategoryPage }/>
        <Route path="/furniture/:fId" component={ FurniturePage }/>
        <Route path="/administrator/login" component={ AdministratorLoginPage }/>
        <Route exact path="/administrator/dashboard" component={ AdministratorDashboard }/>
        <Route exact path="/administrator/dashboard/category" component={ AdministratorCategory }/>
        <Route path="/administrator/dashboard/feature/:cId" component={ AdministratorFeature }/>
        <Route path="/administrator/dashboard/furnitures/" component = { AdministratorFurniture }/>
        <Route path="/administrator/dashboard/photo/:fId" component = { AdministratorPhoto }/>

      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
