import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ButtonPrimary from './ButtonPrimary';
import { makeStyles } from '@material-ui/core';

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

  const validate = (response) => {
    if (response.status === 200) {
      console.log('user exists');
      return true;
    } else if (response.status !== 200) {
      console.log('user does not exist');
      return false;
    }
  };

  const checkAssignedUserExists = async () => {
    const token = localStorage.getItem('partnerFinderToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch('https://cfd-partner-finder-api.xyz/users', {
      headers: headers,
    });
    console.log('res', response);
    return validate(response);
  };

  const checkValidPhone = (number) => {
    const extractedNums = number.replace(/[^0-9]/g, '');
    if (extractedNums.length !== 10) {
      return false;
    } else {
      return extractedNums;
    }
  };

  const validateInputs = () => {
    checkAssignedUserExists();
    const validEmail = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    var validUrl = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );

    if (!companyName) {
      throw new Error('Company name is required');
    } else if (!validEmail.test(email)) {
      throw new Error('Please enter a valid email');
    } else if (!checkValidPhone(phone)) {
      throw new Error('Please enter a valid phone number');
    } else if (checkValidPhone(phone)) {
      //if valid phone, formats into standardized (XXX) XXX-XXXX
      const num = checkValidPhone(phone);
      const formattedPhoneNumber = `(${num.slice(0, 3)}) ${num.slice(
        3,
        6
      )}-${num.slice(6, 10)}`;
      setPhone(formattedPhoneNumber);
    } else if (facebook && !validUrl.test(facebook)) {
      throw new Error('Please enter only valid URLs');
    } else if (instagram && !validUrl.test(instagram)) {
      throw new Error('Please enter only valid URLs');
    } else if (linkedin && !validUrl.test(linkedin)) {
      throw new Error('Please enter only valid URLs');
    } else if (twitter && !validUrl.test(twitter)) {
      throw new Error('Please enter only valid URLs');
    } else if (website && !validUrl.test(website)) {
      throw new Error('Please enter only valid URLs');
    } else if (!checkAssignedUserExists()) {
      throw new Error('Username does not match any in our records');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      validateInputs();
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
    } catch (err) {
      console.log('error!!!', err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box className={classes.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add a Lead
        </Typography>
        <form className={classes.form}>
          <label className={classes.label}>
            Company Name*
            <input
              type="text"
              className={classes.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
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
          <label className={classes.label}>
            Email
            <input
              type="text"
              className={classes.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Phone
            <input
              type="text"
              className={classes.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Website
            <input
              type="url"
              className={classes.input}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Facebook
            <input
              type="url"
              className={classes.input}
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Instagram
            <input
              type="url"
              className={classes.input}
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            LinkedIn
            <input
              type="url"
              className={classes.input}
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </label>
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
          <ButtonPrimary marginRight="1em" onClick={() => onClose()}>
            Back
          </ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};
