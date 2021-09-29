import React from 'react';

import { makeStyles, InputBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: '#E5E5E5',
    flexBasis: '25%',
    paddingLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
}))

export default function Search() {
    const classes = useStyles();

    return (
      <div className={classes.search}>
        <InputBase placeholder="Search..." />
      </div>
    )
}
