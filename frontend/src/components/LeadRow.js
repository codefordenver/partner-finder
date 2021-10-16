import React, { useState } from 'react';
import { TableRow, TableCell, Box } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { useStyles } from './Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const SocialMediaLink = ({ lead }) => {
  const availableLinks = [];
  if ('facebook' in lead && lead['facebook'] !== '') {
    availableLinks.push(
      <a href={lead['facebook']} target="_blank" rel="noopener noreferrer">
        <FacebookIcon />
      </a>
    );
  }
  if ('linkedin' in lead && lead['linkedin'] !== '') {
    availableLinks.push(
      <a href={lead['linkedin']} target="_blank" rel="noopener noreferrer">
        <LinkedInIcon />
      </a>
    );
  }
  if ('twitter' in lead && lead['twitter'] !== '') {
    availableLinks.push(
      <a href={lead['twitter']} target="_blank" rel="noopener noreferrer">
        <TwitterIcon />
      </a>
    );
  }
  if ('instagram' in lead && lead['instagram'] !== '') {
    availableLinks.push(
      <a href={lead['instagram']} target="_blank" rel="noopener noreferrer">
        <InstagramIcon />
      </a>
    );
  }

  return <div>{availableLinks}</div>;
};

export const LeadRow = ({ lead }) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>{lead['company_name']}</TableCell>
      <TableCell>
        {lead['email'] ? (
          <a href={`mailto:${lead['email']}`}>
            <MailOutlineIcon />
          </a>
        ) : (
          <></>
        )}
      </TableCell>
      <TableCell>
        <a target="no_blank" href={lead['website']}>
          {lead['website']}
        </a>
      </TableCell>
      <TableCell>
        <SocialMediaLink lead={lead} />
      </TableCell>
      <TableCell>{lead['assignee']}</TableCell>
      {/* TODO: get tags */}
      <TableCell></TableCell>
      <TableCell>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box className={classes.roundButton}>
            <EditOutlinedIcon />
          </Box>
          <Box className={classes.roundButton}>
            <DeleteOutlineOutlinedIcon />
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};
