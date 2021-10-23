import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { makeStyles, Button, Box, Typography } from '@material-ui/core';
import { LeadTable } from './LeadTable';
import ButtonPrimary from './ButtonPrimary';
import Header from './Header';
import PaginationControl from './PaginationControl';
import Search from './Search';
import { API_HOST } from '../config';
import { LeadModal } from './LeadModal';
import { DEBOUNCE_TIME_MS } from '../constants';

export const useStyles = makeStyles((theme) => ({
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
    position: 'sticky',
    bottom: '0',
    width: '100%',
    height: '50px',
    fontSize: '1.2em',
    color: '#fff',
    textTransform: 'capitalize',
    background: theme.palette.primary.main,
    borderRadius: '0px',
    marginTop: '0.4rem',
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
  link: {
    textDecoration: 'none',
    color: '#fff',
  },
  tagColumn: {
    width: '100px',
  },
  chip: {
    margin: '2.5px',
  },
  avatar: {
    background: '#E14E54',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [maxpages, setMaxPages] = useState(100);
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [newLead, setNewLead] = useState(false);
  const [username, setUsername] = useState('');

  const history = useHistory();

  // TODO: setup search and tags
  // const [search, setSearch] = useState(null);
  // const [tag, setTag] = useState(null);

  const checkForErrors = (response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      history.push('/login');
    } else {
      throw new Error('Something went wrong');
    }
  };

  const getLeadsUrl = () => {
    if (search) {
      return `${API_HOST}/leads?page=${page}&perpage=${perpage}&search=${search}`;
    }
    return `${API_HOST}/leads?page=${page}&perpage=${perpage}`;
  };

  const getPagesUrl = () => {
    return `${API_HOST}/leads/n_pages?perpage=${perpage}`;
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    const token = localStorage.getItem('partnerFinderToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (!token) {
      history.push('/login');
    }

    fetch(getLeadsUrl(), {
      headers: headers,
    })
      .then((response) => checkForErrors(response))
      .then((data) => {
        setLeads(data.leads);
      })
      .catch((error) => console.error(error.message));

    fetch(getPagesUrl(), {
      headers: headers,
    })
      .then((response) => checkForErrors(response))
      .then((data) => setMaxPages(data.pages))
      .catch((error) => console.error(error.message));
  }, [page, perpage, search, maxpages, newLead]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addLead = (lead) => {
    const token = localStorage.getItem('partnerFinderToken');
    const url = `${API_HOST}/leads`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(lead),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => checkForErrors(response))
      .then(() => handleClose())
      .then(() => setNewLead(true))
      //TODO: should render an error inside of the modal instead of just console.error
      .catch((err) => console.error(err));
  };

  return (
    <div id="home">
      <Header>
        {/* TODO: adjust title font size */}
        {/* TODO: make "Code For Denver" a link back to the home page */}
        <Typography className={classes.logo} variant="h4" component="h1">
          <a
            className={classes.link}
            href="https://codefordenver.org/"
            target="_blank"
          >
            Code For Denver
          </a>
        </Typography>
        <Typography variant="h6" component="h6">
          {username}
        </Typography>
        <Search
          debounceTime={DEBOUNCE_TIME_MS}
          onDebounce={(event) => setSearch(event.target.value)}
        />
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
          <ButtonPrimary marginRight="auto" onClick={handleOpen}>
            Add New
          </ButtonPrimary>
          <LeadModal open={open} onClose={handleClose} addLead={addLead} />

          <PaginationControl
            page={page}
            perpage={perpage}
            maxpages={maxpages}
            setPage={setPage}
            setPerpage={setPerpage}
          />
        </Box>
        <LeadTable leads={leads} />
      </Box>

      <Button className={classes.aboutFooter}>About</Button>
    </div>
  );
}
