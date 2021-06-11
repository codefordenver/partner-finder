import { Box, Button, TextInput } from 'grommet';
import React, { useState } from 'react';

import { Add } from 'grommet-icons';
import { Link } from 'react-router-dom';

const QueryEditor = ({query, onSubmit, hide}) => {
  const [tempQuery, setTempQuery] = useState(query);

  return (
    <Box
      flex
      border={{
        bottom: "2px solid black"
      }}
      direction="column"
      alignContent="start"
      pad="large"
      gap="large"
    >
      <Button
        primary
        label="Hide"
        onClick={hide}
      />

      <Box
        margin={{
          top: "20px"
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
      <Box>
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
      <Box>
        Search:
        <TextInput
          value={tempQuery.search}
          onChange={(event) => {
              let newQuery = { ...tempQuery };
              newQuery.search = event.target.value;
              setTempQuery(newQuery);
          }}
        />
      </Box>

      <Button
        primary
        label="Go"
        onClick={() => onSubmit(tempQuery)}
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
