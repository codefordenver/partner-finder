import React from 'react';

import {
  makeStyles,
  Button,
  Typography,
  TextField,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

import Header from './Header';

const useStyles = makeStyles((theme) => ({
  // TODO: make custom buttonPrimary and roundButton components that use these styles
  buttonPrimary: {
    width: '220px',
    height: '50px',
    fontSize: '1.2em', // guessed on this
    textTransform: 'capitalize',
    background: theme.palette.primary.dark,
    borderRadius: '0px',
    marginRight: 'auto', // positions button to the left edge of the flex container
  },
  roundButton: {
    width: '50px',
    height: '50px',
    background: theme.palette.primary.dark,
    color: '#fff',
    borderRadius: '100px',
    margin: '0 5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  aboutFooter: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '50px',
    fontSize: '1.2em',
    color: '#fff',
    textTransform: 'capitalize',
    background: theme.palette.primary.main,
    borderRadius: '0px',
  },
  pageSelect: {
    display: 'flex',
  },
  paginationTextField: {
    width: '115px',
  },
  leadTable: {
    border: '2px solid #E14E54',
  },
  leadTableHeader: {
    background: theme.palette.primary.main,
  },
  columnName: {
    color: '#fff',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div id="home">
      <Header />
      <Box
        marginX="15px" // TODO: there must be a cleaner way to get the margins
      >
        {/* Row containing "Add New" button and pagination controls */}
        <Box
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

        {/* Table with lead data */}
        <TableContainer className={classes.leadTable}>
          <Table>
            <TableHead className={classes.leadTableHeader}>
              <TableRow>
                <TableCell className={classes.columnName}>Name</TableCell>
                <TableCell className={classes.columnName}>Contact</TableCell>
                <TableCell className={classes.columnName}>Website</TableCell>
                <TableCell className={classes.columnName}>
                  Social Media
                </TableCell>
                <TableCell className={classes.columnName}>Assignee</TableCell>
                <TableCell className={classes.columnName}>Tags</TableCell>
                {/* Extra cell for edit and delete buttons */}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Do Better</TableCell>
                <TableCell>Jane Doe</TableCell>
                <TableCell>www.dobetter.org</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                  >
                    <Box className={classes.roundButton}>
                      <EditOutlinedIcon />
                    </Box>
                    <Box className={classes.roundButton}>
                      <DeleteOutlineOutlinedIcon />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Button className={classes.aboutFooter}>About</Button>
    </div>
  );
}
