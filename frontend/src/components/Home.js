import React from 'react';

import {
  makeStyles,
  Button,
  Typography,
  TextField,
  Box,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Header from './Header';

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
  pageSelect: {
    display: 'flex',
  },
  paginationTextField: {
    width: '115px',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div id="home">
      <Header />
      <Box
        paddingX="15px"
        paddingY="30px"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button
          className={classes.buttonPrimary}
          variant="contained"
          color="primary"
        >
          Add New
        </Button>
        {/* TODO: refactor the following into a PaginationControl component */}
        <Typography>Results</Typography>
        <TextField
          className={classes.paginationTextField}
          variant="outlined"
          defaultValue="10"
        />
        <Button>
          <ChevronLeftIcon></ChevronLeftIcon>
        </Button>
        <Typography>1 / 25</Typography>
        <Button>
          <ChevronRightIcon></ChevronRightIcon>
        </Button>
      </Box>
    </div>
  );
}
