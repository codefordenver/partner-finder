import React, { useState } from 'react';

import { makeStyles, InputBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  search: {
    backgroundColor: '#E5E5E5',
    flexBasis: '25%',
    paddingLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
  },
}));

export default function Search({ onDebounce, debounceTime }) {
  const classes = useStyles();

  const [timeoutId, setTimeoutId] = useState(null);

  const handleChange = (event) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (event.target.value) {
      const newId = setTimeout(
        () => onDebounce(event.target.value),
        debounceTime
      );
      setTimeoutId(newId);
    }
  };

  return (
    <div className={classes.search}>
      <InputBase placeholder="Search..." onChange={handleChange} />
    </div>
  );
}
