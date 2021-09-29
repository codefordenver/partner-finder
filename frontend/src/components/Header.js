import React from 'react';

import { makeStyles, Toolbar, AppBar, Typography } from '@material-ui/core';

import Search from './Search';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logo: {
    fontWeight: 'bold',
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.root}>
        {/* TODO: adjust title font size */}
        {/* TODO: make "Code For Denver" a link back to the home page */}
        <Typography className={classes.logo} variant="h4" component="h1">
          Code For Denver
        </Typography>
        <Search />
      </Toolbar>
    </AppBar>
  );
}
