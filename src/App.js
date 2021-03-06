import React from 'react';
import {Route, Switch } from 'react-router-dom';

import './App.css';

import Employee from './components/Employee/Employee.component';
import AdminComponent from './components/Admin/Admin.component';
import Footer from './components/Footer/Footer.component';
import Sales from './components/Sales/Sales.component';
import Orders from './components/Sales/Orders/Orders.component';
import Receipt from './components/Sales/Receipt/Receipt.component';

function App() {
  return (
    <div className="App_Container">
      <header className="App_Header">
        COCO PIZZA SHOP
      </header>
      <main className="App_Main">  
          
          <Switch>
            <Route exact path='/'  component={Employee} />
            <Route       path='/admin'  component={AdminComponent} />
            <Route       path='/sales'  component={Sales} />
            <Route       path='/orders' component={Orders} />
            <Route       path='/receipt' component={Receipt} />
          </Switch>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
