import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  actionButton: {
    color: theme.palette.error.contrastText,
  },
}));

export default function ErrorSnackbar(props) {
  const classes = useStyles();

  const action = (
    <React.Fragment>
      <Button
        className={classes.actionButton}
        size="small"
        onClick={props.onClose}
      >
        Close
      </Button>
    </React.Fragment>
  );

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={props.open}
      autoHideDuration={10000}
      onClose={props.onClose}
    >
      <SnackbarContent
        className={classes.error}
        message={<span className={classes.message}>{props.message}</span>}
        // set action to props.action if it is defined, else set action to default action
        action={props.action || action}
      />
    </Snackbar>
  );
}
