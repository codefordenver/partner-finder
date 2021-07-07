import { Box, Button, TextInput } from 'grommet';
import React, { useState } from 'react';


const QueryEditor = ({query, onSubmit, hide}) => {
  const [tempQuery, setTempQuery] = useState(query);

  const handleKeyPress = event => (event.key === 'Enter') && onSubmit(tempQuery);

  const updateQueryOnChange = field => event => {
    let newQuery = { ...tempQuery };
    newQuery[field] = event.target.value;
    setTempQuery(newQuery);
  }

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
          onChange={updateQueryOnChange('page')}
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Box>
        Perpage:
        <TextInput
          value={tempQuery.perpage}
          onChange={updateQueryOnChange('perpage')}
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Box>
        Search:
        <TextInput
          value={tempQuery.search}
          onChange={updateQueryOnChange('search')}
          onKeyPress={handleKeyPress}
        />
      </Box>

      <Button
        primary
        label="Find"
        onClick={() => onSubmit(tempQuery)}
      />

    </Box>
  );
};

export default QueryEditor;
