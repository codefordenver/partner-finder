import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ButtonPrimary from '../ButtonPrimary';
import { makeStyles } from '@material-ui/core';
import './LeadModal.css';
import { API_HOST } from '../../config';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    backgroundColor: theme.palette.primary.main,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2em',
    overflow: 'scroll',
    height: '90%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
    margin: '1em',
  },
  input: {
    padding: '0.25em',
    width: '21em',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.75em',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export const LeadModal = ({ open, onClose, addLead }) => {
  const classes = useStyles();
  const [assigned, setAssigned] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [users, setUsers] = useState([]);

  const clearForm = () => {
    setAssigned('');
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsite('');
    setFacebook('');
    setInstagram('');
    setLinkedin('');
    setTwitter('');
  };

  const checkForErrors = (response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong');
    }
  };

  useEffect(() => {
    const getUsers = async () => {
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
    };
    getUsers();
  }, []);

  const checkValidPhone = (number) => {
    const extractedNums = number.replace(/[^0-9]/g, '');
    if (extractedNums.length !== 10) {
      return false;
    } else {
      return extractedNums;
    }
  };

  const checkValidEmail = (email) => {
    const validEmail = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    return validEmail.test(email);
  };

  const checkValidUrl = (url) => {
    var validUrl = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return validUrl.test(url);
  };

  const checkAssignedUserExists = (assignedUser) => {
    if (users.includes(assignedUser)) {
      return true;
    } else {
      return false;
    }
  };

  const resetErrors = () => {
    let element;
    const ids = [
      'companyNameValidation',
      'phoneValidation',
      'fbValidation',
      'instagramValidation',
      'linkedinValidation',
      'twitterValidation',
      'websiteValidation',
      'emailValidation',
      'userValidation',
    ];
    ids.forEach((id) => {
      element = document.getElementById(id);
      element.classList.add('hidden');
    });
  };

  const validateInputs = () => {
    let element;
    resetErrors();
    let error = false;
    if (!companyName) {
      element = document.getElementById('companyNameValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (phone && !checkValidPhone(phone)) {
      element = document.getElementById('phoneValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (phone && checkValidPhone(phone)) {
      //if valid phone, formats into standardized (XXX) XXX-XXXX
      const num = checkValidPhone(phone);
      const formattedPhoneNumber = `(${num.slice(0, 3)}) ${num.slice(
        3,
        6
      )}-${num.slice(6, 10)}`;
      setPhone(formattedPhoneNumber);
      error = false;
    }
    if (facebook && !checkValidUrl(facebook)) {
      element = document.getElementById('fbValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (instagram && !checkValidUrl(instagram)) {
      element = document.getElementById('instagramValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (linkedin && !checkValidUrl(linkedin)) {
      element = document.getElementById('linkedinValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (twitter && !checkValidUrl(twitter)) {
      element = document.getElementById('twitterValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (website && !checkValidUrl(website)) {
      element = document.getElementById('websiteValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (email && !checkValidEmail(email)) {
      element = document.getElementById('emailValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (assigned && !checkAssignedUserExists(assigned)) {
      element = document.getElementById('userValidation');
      element.classList.remove('hidden');
      error = true;
    }
    if (error) {
      return false;
    } else {
      return true;
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const newLead = {
        assigned: assigned,
        'company_name': companyName,
        'contact_name': contactName,
        'data_source': 'user_entry',
        email: email,
        phone: phone,
        facebook: facebook,
        instagram: instagram,
        linkedin: linkedin,
        twitter: twitter,
        website: website,
      };
      addLead(newLead);
      clearForm();
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box className={classes.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add a Lead
        </Typography>
        <form className={classes.form}>
          <span className="error hidden" id="companyNameValidation">
            <span>Company name is required</span>
          </span>
          <label className={classes.label}>
            Company Name*
            <input
              type="text"
              className={classes.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
          <span className="error hidden" id="userValidation">
            <span>Enter a valid username</span>
          </span>
          <label className={classes.label}>
            Assigned
            <input
              type="text"
              className={classes.input}
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Contact Name
            <input
              type="text"
              className={classes.input}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </label>
          <span className="error hidden" id="emailValidation">
            <span>Please enter a valid email address</span>
          </span>
          <label className={classes.label}>
            Email
            <input
              type="text"
              className={classes.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <span className="error hidden" id="phoneValidation">
            <span>Please enter a valid ten digit phone number</span>
          </span>
          <label className={classes.label}>
            Phone
            <input
              type="text"
              className={classes.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <span className="error hidden" id="websiteValidation">
            <span>Please enter a valid url</span>
          </span>
          <label className={classes.label}>
            Website
            <input
              type="url"
              className={classes.input}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
          <span className="error hidden" id="fbValidation">
            <span>Please enter a valid url</span>
          </span>
          <label className={classes.label}>
            Facebook
            <input
              type="url"
              className={classes.input}
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </label>
          <span className="error hidden" id="instagramValidation">
            <span>Please enter a valid url</span>
          </span>
          <label className={classes.label}>
            Instagram
            <input
              type="url"
              className={classes.input}
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </label>
          <span className="error hidden" id="linkedinValidation">
            <span>Please enter a valid url</span>
          </span>
          <label className={classes.label}>
            LinkedIn
            <input
              type="url"
              className={classes.input}
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </label>
          <span className="error hidden" id="twitterValidation">
            <span>Please enter a valid url</span>
          </span>
          <label className={classes.label}>
            Twitter
            <input
              type="url"
              className={classes.input}
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </label>
        </form>
        <div className={classes.buttonContainer}>
          <ButtonPrimary marginRight="1em" onClick={(e) => handleSave(e)}>
            Save
          </ButtonPrimary>
          <ButtonPrimary marginRight="1em" onClick={() => clearForm()}>
            Reset
          </ButtonPrimary>
          <ButtonPrimary marginRight="1em" onClick={() => handleClose()}>
            Back
          </ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};
