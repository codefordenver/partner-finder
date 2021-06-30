import React, { Fragment } from 'react';
import { Text, TextInput } from 'grommet';

const EditableInput = ({ editMode, lead, field, alias, onChange }) => {
  return (
    <Fragment>
      {editMode ? (
        <Text>
          <b>{alias}: </b> <TextInput value={lead[field]} onChange={onChange} />
        </Text>
      ) : (
        <Text>
          <b>{alias}: </b> {lead[field]}
        </Text>
      )}
    </Fragment>
  );
};

export default EditableInput;
