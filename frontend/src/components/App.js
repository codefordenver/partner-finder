import React from 'react';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@material-ui/core';

import About from './About';
import Home from './Home';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E14E54',
      dark: '#C90E17',
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
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <ProtectedRoute path="/home">
              <Home />
            </ProtectedRoute>
            <Route path="/">
              <Redirect to="home" />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
