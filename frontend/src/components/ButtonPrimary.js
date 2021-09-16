import React from 'react';

import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonPrimary: {
    width: '220px',
    height: '50px',
    fontSize: '1.2em', // guessed on this
    textTransform: 'capitalize',
    background: theme.palette.primary.dark,
    borderRadius: '0px',
    marginRight: 'auto', // positions button to the left edge of the flex container
  },
}))

export default function ButtonPrimary({children}) {
  const classes = useStyles();

  return (
  <Button
    className={classes.buttonPrimary}
    variant="contained"
    color="primary"
  >
    {children}
  </Button>
  )
}