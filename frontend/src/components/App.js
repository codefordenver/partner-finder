import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@material-ui/core';

import About from './About';
import Home from './Home';
import Login from './Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E14E54',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div id="app">
        <CssBaseline />
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
    </ThemeProvider>
  );
}
