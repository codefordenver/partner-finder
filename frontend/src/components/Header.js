import React from 'react';

import {
  makeStyles,
  Toolbar,
  AppBar,
  Typography,
  InputBase,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logo: {
    fontWeight: 'bold',
  },
  search: {
    backgroundColor: '#E5E5E5',
    flexBasis: '25%',
    paddingLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
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
        <div className={classes.search}>
          <InputBase placeholder="Search..." />
        </div>
      </Toolbar>
    </AppBar>
  );
}
