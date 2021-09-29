import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
  },
  input: {
    padding: '0.25em',
    margin: '0.5em',
    width: '20em',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export const LeadModal = ({ open, onClose }) => {
  const classes = useStyles();
  const [assigned, setAssigned] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [Website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box className={classes.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add a Lead
        </Typography>
        <form className={classes.form}>
          <label className={classes.label}>
            Assigned*
            <input
              type="text"
              className={classes.input}
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Company Name*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Contact Name*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setContactName(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Data Source*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setDataSource(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Email*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Phone*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Website*
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Facebook
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Instagram
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            LinkedIn
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </label>
          <label className={classes.label}>
            Twitter
            <input
              type="text"
              className={classes.input}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </label>
        </form>
        <div className={classes.buttonContainer}>
          <ButtonPrimary>Save</ButtonPrimary>
          <ButtonPrimary>Reset</ButtonPrimary>
          <ButtonPrimary>Back</ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};
