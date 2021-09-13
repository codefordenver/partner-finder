import React, { useEffect } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@material-ui/core';

import About from './About';
import Home from './Home';
import Login from './Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E14E54',
      dark: '#C90E17',
    },
  },
});

export default function App() {
  // for now, login to api as a dev user and save the access token in local storage
  // TODO: implement a login form that does this

  useEffect(() => {
    const url = `http://${process.env.API_HOST}/login`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.API_USER,
        // username: 'dev01@gmail.com',
        password: process.env.API_PASSWORD,
        // password: 'Linu$Torvald$',
      }),
    })
      .then((response) => response.json())
      .then((data) => localStorage.setItem('partnerFinderToken', data.token));
  }, []);

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
