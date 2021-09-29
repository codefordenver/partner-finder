import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { useStyles } from './Home';

export const LeadRow = ({ lead }) => {
  const classes = useStyles();

  return (
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
