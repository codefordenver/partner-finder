import React, { useState } from 'react';
import { TableRow, TableCell, Box } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { useStyles } from './Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const SocialMediaLink = ({ lead }) => {
  const link =
    lead['facebook'] ||
    lead['linkedin'] ||
    lead['twitter'] ||
    lead['instagram'] ||
    null;

  return (
    <a href={link} target="no_blank">
      {
      link && link.includes('facebook') ? 
      <FacebookIcon/> :

      link && link.includes('linkedin') ? 
      <LinkedInIcon/> :

      link && link.includes('twitter') ?
      <TwitterIcon/> :

      link && link.includes('instagram') ?
      <InstagramIcon/> :
      
      link
      }
    </a>
  );
};

export const LeadRow = ({ lead }) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>{lead['company_name']}</TableCell>
      <TableCell>{lead['contact_name']}</TableCell>
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
