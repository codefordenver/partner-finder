import React from 'react';
import { makeStyles, Typography, TextField, Box } from '@material-ui/core';
import { NoEncryption } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  aboutPage: {
    height: '100vh',
    // TODO: use the theme to set the background color
    background: '#ED686F',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutHeader: {
    color: 'white',
    width: '40%',
    textAlign: 'center',
    fontWeight: '400',
  },
  aboutPageHeader: {
    color: 'white',
    position: 'relative',
    marginBottom: '40px',
  },
  aboutText: {
    background: 'white',
    width: '390px',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Box className={classes.aboutPage}>
      <Typography
        className={classes.aboutHeader}
        variant="h2"
        component="h1"
        gutterBottom
      >
        Code For Denver Partner Finder
      </Typography>
      <Typography
        className={classes.aboutPageHeader}
        variant="h3"
        component="h2"
      >
        About
      </Typography>
      <Box className={classes.aboutText}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          marginBottom="40px"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            efficitur volutpat sem, vel convallis nisl dignissim eget. Quisque
            molestie fermentum nisl vitae tincidunt.
          </p>
        </Box>
      </Box>
    </Box>
  );
}
