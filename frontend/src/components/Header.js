import React from 'react';

import { makeStyles, Toolbar, AppBar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

export default function Header({ children }) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.root}>
        { children }
      </Toolbar>
    </AppBar>
  );
}
