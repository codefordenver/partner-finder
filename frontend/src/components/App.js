import React, { Fragment } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import About from './About';
import Home from './Home';
import Login from './Login';

export default function App() {
  return (
    <div id="app">
      <h1>App</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
