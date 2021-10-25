import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { useStyles } from './Home';
import { LeadRow } from './LeadRow';

export const LeadTable = ({ leads }) => {
  const classes = useStyles();

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
            <TableCell className={`${classes.columnName} ${classes.tagColumn}`}>
              Tags
            </TableCell>
            {/* Extra cell for edit and delete buttons */}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
