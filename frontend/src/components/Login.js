import React from 'react';

import { makeStyles, Typography, TextField, Box } from '@material-ui/core';

import ButtonPrimary from './ButtonPrimary';

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
            variant="outlined"
          />
        </Box>
        <ButtonPrimary>Login</ButtonPrimary>
      </Box>
    </Box>
  );
}
