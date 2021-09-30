import React, { useState, Fragment } from 'react';
import { makeStyles, Typography, TextField, Button } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { DEBOUNCE_TIME_MS } from '../constants';

const useStyles = makeStyles((theme) => ({
  paginationTextField: {
    width: '115px',
  },
}));

export default function PaginationControl({
  page,
  perpage,
  maxpages,
  setPage,
  setPerpage,
}) {
  const classes = useStyles();

  const [state, setState] = useState({
    timeoutId: null,
    perpageText: perpage,
  });

  const handlePerpageChange = (event) => {
    let newPerpage = parseInt(event.target.value, 10);
    if (newPerpage < 1) {
      newPerpage = 1;
    }
    if (newPerpage > 100) {
      newPerpage = 100;
    }
    // debounces (delays) changes to perpage
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }
    if (newPerpage) {
      const newId = setTimeout(() => setPerpage(newPerpage), DEBOUNCE_TIME_MS);
      setState({
        ...state,
        timeoutId: newId,
        perpageText: newPerpage,
      });
    } else {
      setState({
        ...state,
        perpageText: event.target.value,
      });
    }
  };

  return (
    <Fragment>
      <Typography>Results</Typography>
      <TextField
        className={classes.paginationTextField}
        value={state.perpageText}
        variant="outlined"
        onChange={handlePerpageChange}
      />
      <Button onClick={() => setPage(page - 1 > 0 ? page - 1 : 1)}>
        <ChevronLeftIcon></ChevronLeftIcon>
      </Button>
      <Typography>
        {page} / {maxpages}
      </Typography>
      <Button onClick={() => setPage(page + 1 <= 100 ? page + 1 : 100)}>
        <ChevronRightIcon></ChevronRightIcon>
      </Button>
    </Fragment>
  );
}
