import React from 'react';
import { TableRow, TableCell, Box, Chip } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { useStyles } from './Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SocialMediaLink = ({ lead }) => {
  const availableLinks = [];
  if ('facebook' in lead && lead['facebook'] !== '') {
    availableLinks.push(
      <a
        href={lead['facebook']}
        target="_blank"
        rel="noopener noreferrer"
        key="facebook"
      >
        <FacebookIcon />
      </a>
    );
  }
  if ('linkedin' in lead && lead['linkedin'] !== '') {
    availableLinks.push(
      <a
        href={lead['linkedin']}
        target="_blank"
        rel="noopener noreferrer"
        key="linkedin"
      >
        <LinkedInIcon />
      </a>
    );
  }
  if ('twitter' in lead && lead['twitter'] !== '') {
    availableLinks.push(
      <a
        href={lead['twitter']}
        target="_blank"
        rel="noopener noreferrer"
        key="twitter"
      >
        <TwitterIcon />
      </a>
    );
  }
  if ('instagram' in lead && lead['instagram'] !== '') {
    availableLinks.push(
      <a
        href={lead['instagram']}
        target="_blank"
        rel="noopener noreferrer"
        key="instagram"
      >
        <InstagramIcon />
      </a>
    );
  }

  return <div>{availableLinks}</div>;
};

export const LeadRow = ({ lead, users }) => {
  const classes = useStyles();
console.log(lead)
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
      <TableCell>
        {/* {lead['assigned'] && ( */}
          <Autocomplete
            disablePortal
            id="assignee-field"
            options={users}
            sx={{ width: 300 }}
            defaultValue={lead.assigned && lead.assigned}
            renderInput={(params) => <TextField {...params} label={lead.assigned ? lead.assigned : 'Assignee'} />}
          />
         
        {/* )} */}
      </TableCell>
      <TableCell>
        {lead['tags'].map((tag) => (
          <Chip
            key={tag.id}
            label={tag.tag}
            className={classes.chip}
            size="small"
            variant="outlined"
          />
        ))}
      </TableCell>
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

//  {/* <Avatar className={classes.avatar}>
//             <p title={lead['assigned']}>
//               {lead['assigned'].charAt(0).toUpperCase()}
//             </p>
//           </Avatar> */}