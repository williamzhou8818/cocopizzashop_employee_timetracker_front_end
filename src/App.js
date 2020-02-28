import React from 'react';
import {Route, Switch } from 'react-router-dom';

import './App.css';

import Employee from './components/Employee/Employee.component';
import AdminComponent from './components/Admin/Admin.component';
import Footer from './components/Footer/Footer.component';

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
          </Switch>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
