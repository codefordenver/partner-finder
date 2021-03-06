import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  makeStyles,
  Button,
  Box,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import { LeadTable } from './LeadTable';
import ButtonPrimary from './ButtonPrimary';
import Header from './Header';
import PaginationControl from './PaginationControl';
import Search from './Search';
import { API_HOST } from '../config';
import { LeadModal } from './LeadModal/LeadModal';
import { DEBOUNCE_TIME_MS } from '../constants';
import ErrorSnackbar from './ErrorSnackbar';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [tag, setTag] = useState('');
  const [tagOptions, setTagOptions] = useState([]);
  const [users, setUsers] = useState([]);

  const history = useHistory();

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
    if (search && tag) {
      return `${API_HOST}/leads?search=${search}&tag=${tag}&page=${page}&perpage=${perpage}`;
    } else if (tag) {
      return `${API_HOST}/leads?tag=${tag}&page=${page}&perpage=${perpage}`;
    } else if (search) {
      return `${API_HOST}/leads?page=${page}&perpage=${perpage}&search=${search}`;
    }
    return `${API_HOST}/leads?page=${page}&perpage=${perpage}`;
  };

  const getPagesUrl = () => {
    if (search && tag) {
      return `${API_HOST}/leads/n_pages?search=${search}&tag=${tag}&page=${page}&perpage=${perpage}`;
    } else if (tag) {
      return `${API_HOST}/leads/n_pages?tag=${tag}&page=${page}&perpage=${perpage}`;
    } else if (search) {
      return `${API_HOST}/leads/n_pages?page=${page}&perpage=${perpage}&search=${search}`;
    }
    return `${API_HOST}/leads/n_pages?page=${page}&perpage=${perpage}`;
  };

  const getTagsUrl = () => {
    return `${API_HOST}/tags`;
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('partnerFinderToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${API_HOST}/users`, {
        headers: headers,
      });
      const data = await checkForErrors(response);
      setUsers(data.users);
    } catch (err) {
      console.log(err.message);
    }
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
      .catch((error) => {
        console.log(error);
        setErrorMessage('Failed to fetch Leads!');
      });

    fetch(getPagesUrl(search), {
      headers: headers,
    })
      .then((response) => checkForErrors(response))
      .then((data) => setMaxPages(data.pages))
      .catch((error) => {
        setErrorMessage('Failed to fetch Pages!');
      });

    fetch(getTagsUrl(), {
      headers: headers,
    })
      .then((response) => checkForErrors(response))
      .then((data) => setTagOptions(data.tags))
      .catch((error) => {
        setErrorMessage('Failed to fetch Tags!');
      });

    getUsers();
  }, [page, perpage, search, maxpages, newLead, tag]);

  const checkAssignedUserExists = (assignedUser) => {
    return users.includes(assignedUser);
  };

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
      //TODO: should render an error inside of the modal instead of just console.error
      .catch((err) => console.error(err));
  };

  const editLead = (newValue, id) => {
    const token = localStorage.getItem('partnerFinderToken');
    const url = `${API_HOST}/leads/${id}`;
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(newValue),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => checkForErrors(response))
      .then(() => setNewLead(true))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (errorMessage) {
      setShowErrorSnackbar(true);
    }
  }, [errorMessage]);

  const onCloseErrorSnackbar = () => {
    setShowErrorSnackbar(false);
  };

  // function to remove token from local storage and redirect user when logging out
  const logout = () => {
    localStorage.removeItem('partnerFinderToken');
    history.push('/login');
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
          {'\u0009'}
          <button onClick={logout}>Logout</button>
        </Typography>
        <Search
          debounceTime={DEBOUNCE_TIME_MS}
          onDebounce={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="select-tag-label">Tag</InputLabel>
          <Select
            labelId="select-tag-label"
            id="select-tag"
            value={tag ? tag : ''}
            onChange={(event) => {
              setTag(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {tagOptions.map((tagOption) => (
              <MenuItem key={tagOption.tag} value={tagOption.tag}>
                {tagOption.tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <LeadTable leads={leads} users={users} editLead={editLead} />
      </Box>

      <Button className={classes.aboutFooter}>About</Button>

      <ErrorSnackbar
        open={showErrorSnackbar}
        onClose={onCloseErrorSnackbar}
        message={errorMessage}
      />
    </div>
  );
}
