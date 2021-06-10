import { Box, Button, TextInput } from 'grommet';
import React, { useState } from 'react';

import { Add } from 'grommet-icons';
import { Link } from 'react-router-dom';

const QueryEditor = ({query, onSubmit}) => {
  const [tempQuery, setTempQuery] = useState(query);

  return (
    <Box
      flex
      height={{ min: '10%', max: '20%' }}
      border={{
        bottom: "2px solid black"
      }}
      // elevation="medium"
      direction="column"
      alignContent="start"
      pad="large"
      gap="large"
    >
      <Box
        margin={{
            vertical: "medium"
        }}
      >
        Page:
        <TextInput
          value={tempQuery.page}
          onChange={(event) => {
              let newQuery = { ...tempQuery };
              newQuery.page = event.target.value;
              setTempQuery(newQuery);
          }}
        />
      </Box>
      <Box
        margin={{
            vertical: "medium"
        }}
      >
        Perpage:
        <TextInput
          value={tempQuery.perpage}
          onChange={(event) => {
              let newQuery = { ...tempQuery };
              newQuery.perpage = event.target.value;
              setTempQuery(newQuery);
          }}
        />
      </Box>
      <Button
        primary
        size="large"
        label="Go"
        onClick={() => onSubmit(tempQuery)}
        alignSelf="end"
        margin={{
            vertical: "medium"
        }}
      />
      <Link to="/leads/create">
        <Button
          icon={< Add />}
          label={ "New" }
        />
      </Link>

    </Box>
  );
};

export default QueryEditor;
