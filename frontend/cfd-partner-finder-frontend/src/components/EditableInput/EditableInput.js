import React, { useState, Fragment } from 'react';
import { Box, Text, TextInput } from 'grommet';

const EditableInput = ({ editMode, lead, field, alias, onChange }) => {
  return (
    <Fragment>
      {editMode ? (
      <TextInput value={lead[field]} onChange={onChange} />) : (
      <Text>
        <b>{alias}: </b> {lead[field]}
      </Text>
      )}
    </Fragment>
  )
};

export default EditableInput;
