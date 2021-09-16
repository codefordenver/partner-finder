import React from 'react';

import { makeStyles, Typography, TextField, Box } from '@material-ui/core';

import ButtonPrimary from './ButtonPrimary';

const useStyles = makeStyles((theme) => ({
  loginPage: {
    height: '100vh',
    background: theme.palette.primary.light,
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
  },
  loginForm: {
    background: 'white',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));

export default function Login() {
  const classes = useStyles();

  return (
    <Box className={classes.loginPage}>
      <Typography className={classes.loginHeader} variant="h2" component="h1" gutterBottom>
        Code For Denver Partner Finder
      </Typography>
      <Box className={classes.loginForm}>
        <span>
          <label htmlFor="username">Username</label>
          <TextField
            id="username"
            name="username"
            label="Outlined"
            variant="outlined"
          />
        </span>
        <span>
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            name="password"
            label="Outlined"
            variant="outlined"
          />
        </span>
        <ButtonPrimary>Login</ButtonPrimary>
      </Box>
    </Box>
  );
}
