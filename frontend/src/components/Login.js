import React, { useState } from 'react';

import { makeStyles, Typography, TextField, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';

import { API_HOST } from '../config';
import ButtonPrimary from './ButtonPrimary';

const NO_ERRORS = '';

const USER_NOT_FOUND = 'User not found';

const INVALID_PASSWORD = 'Invalid password';

const useStyles = makeStyles((theme) => ({
  loginPage: {
    height: '100vh',
    // TODO: use the theme to set the background color
    background: '#ED686F',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginHeader: {
    color: 'white',
    width: '40%',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: '40px',
  },
  loginForm: {
    background: 'white',
    width: '390px',
    height: '420px',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    marginRight: '10px',
    fontSize: '1.3em',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState({
    username: '',
    password: '',
    errorMessage: NO_ERRORS,
  });
  const username = state.username;
  const password = state.password;
  const errorMessage = state.errorMessage;

  const handleSubmit = (event) => {
    const url = `${API_HOST}/login`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then(({ success, token, details }) => {
        const detailsParsed = details && JSON.parse(details);
        if (success) {
          localStorage.setItem('partnerFinderToken', token);
          localStorage.setItem('username', username);
          history.push('/');
        } else if (detailsParsed && detailsParsed.user_found) {
          setState({
            ...state,
            errorMessage: INVALID_PASSWORD,
          });
        } else {
          setState({
            ...state,
            errorMessage: USER_NOT_FOUND,
          });
        }
      });
  };

  return (
    <Box className={classes.loginPage}>
      <Typography
        className={classes.loginHeader}
        variant="h2"
        component="h1"
        gutterBottom
      >
        Code For Denver Partner Finder
      </Typography>
      <Box className={classes.loginForm}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          marginBottom="40px"
        >
          <label className={classes.inputLabel} htmlFor="username">
            Username
          </label>
          <TextField
            id="username"
            name="username"
            variant="outlined"
            onChange={(event) =>
              setState({
                ...state,
                username: event.target.value,
                errorMessage: NO_ERRORS,
              })
            }
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          marginBottom="40px"
        >
          <label className={classes.inputLabel} htmlFor="password">
            Password
          </label>
          <TextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            onChange={(event) =>
              setState({
                ...state,
                password: event.target.value,
                errorMessage: NO_ERRORS,
              })
            }
          />
        </Box>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <ButtonPrimary
          marginTop={errorMessage ? '20px' : '0'}
          onClick={handleSubmit}
        >
          Login
        </ButtonPrimary>
      </Box>
    </Box>
  );
}
