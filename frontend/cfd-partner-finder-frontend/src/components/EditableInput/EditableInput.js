import React, { useState, Fragment } from 'react';
import { Text, TextInput } from 'grommet';

const EditableInput = ({ editMode, lead, field, alias, onChange, edits }) => {
  const [focus, setFocus] = useState(false);
  const value = lead[field] || '';
  const editing = focus || edits;
  return (
    <Fragment>
      {editMode ? (
        <Text>
          <b>{alias}: </b>
          <TextInput
            value={value}
            onChange={onChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ color: editing ? 'black' : 'grey' }}
          />
        </Text>
      ) : (
        <Text>
          <b>{alias}: </b> {value}
        </Text>
      )}
    </Fragment>
  );
};

export default EditableInput;
