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
    marginRight: props => props.marginRight,
  },
}))

export default function ButtonPrimary({children, ...styles}) {
  const classes = useStyles(styles);

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