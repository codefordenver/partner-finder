import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';
import {
  makeStyles,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

import ButtonPrimary from './ButtonPrimary';
import Header from './Header';
import PaginationControl from './PaginationControl';
import Search from './Search';
import { API_HOST } from '../config';

const useStyles = makeStyles((theme) => ({
  // TODO: make custom roundButton component
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
  logo: {
    fontWeight: 'bold',
  },
}));

export default function Home() {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [search, setSearch] = useState('');

  const [leads, setLeads] = useState([]);

  const history = useHistory();

  useEffect(() => {
    let url = `${API_HOST}/leads?page=${page}&perpage=${perpage}`;
    if (search) {
      url += `&search=${search}`;
    }
    const token = localStorage.getItem('partnerFinderToken');
    if (!token) {
      history.push('/login');
    }
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          history.push('/login');
        } else {
          return response.json();
        }
      })
      .then((data) => setLeads(data.leads));
  }, [page, perpage, search]);

  return (
    <div id="home">
      <Header>
        {/* TODO: adjust title font size */}
        {/* TODO: make "Code For Denver" a link back to the home page */}
        <Typography className={classes.logo} variant="h4" component="h1">
          Code For Denver
        </Typography>
        <Search debounceTime={500} onDebounce={event => setSearch(event.target.value)} />
      </Header>
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
          <ButtonPrimary marginRight="auto">Add New</ButtonPrimary>

          <PaginationControl
            page={page}
            perpage={perpage}
            maxpages={100}
            setPage={setPage}
            setPerpage={setPerpage}
          />
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
              {leads.map((lead) => (
                <TableRow>
                  <TableCell>{lead['company_name']}</TableCell>
                  <TableCell>{lead['contact_name']}</TableCell>
                  <TableCell>{lead['website']}</TableCell>
                  <TableCell>
                    {lead['facebook'] ||
                      lead['linkedin'] ||
                      lead['twitter'] ||
                      lead['instagram']}
                  </TableCell>
                  <TableCell>{lead['assignee']}</TableCell>
                  {/* TODO: get tags */}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Button className={classes.aboutFooter}>About</Button>
    </div>
  );
}
