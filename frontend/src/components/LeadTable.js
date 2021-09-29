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
import { LeadRow } from './LeadRow';

export const LeadTable = ({ leads }) => {
  const classes = useStyles();

  const makeLeadRows = () => {
    return leads.map((lead) => <LeadRow lead={lead} />);
  };

  return (
    <TableContainer className={classes.leadTable}>
      <Table>
        <TableHead className={classes.leadTableHeader}>
          <TableRow>
            <TableCell className={classes.columnName}>Name</TableCell>
            <TableCell className={classes.columnName}>Contact</TableCell>
            <TableCell className={classes.columnName}>Website</TableCell>
            <TableCell className={classes.columnName}>Social Media</TableCell>
            <TableCell className={classes.columnName}>Assignee</TableCell>
            <TableCell className={classes.columnName}>Tags</TableCell>
            {/* Extra cell for edit and delete buttons */}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{leads.length && makeLeadRows(leads)}</TableBody>
      </Table>
    </TableContainer>
  );
};
