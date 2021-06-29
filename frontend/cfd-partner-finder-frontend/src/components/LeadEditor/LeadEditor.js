import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Text, TextInput } from 'grommet';
import { Save, Close, Edit, Home } from 'grommet-icons';

const LeadEditor = ({ initFields, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [fields, setFields] = useState(initFields);

  return (
    <div>
      <div>
        {fields.map((field) => {
          return (
            <EditableField
              key={`editable_field_${field.field}`}
              editMode={editMode}
              initialValue={field.value}
              fieldAlias={field.alias}
              onChange={(event) => {
                setFields(
                  fields.map((f) => {
                    if (f.field === field.field) {
                      f.value = event.target.value;
                      return f;
                    }
                    return f;
                  })
                );
              }}
            />
          );
        })}
      </div>
      <div>
        {editMode ? (
          <React.Fragment>
            <Button
              secondary
              label="Save"
              icon={<Save />}
              onClick={() => {
                console.log(fields);
                onSave(fields);
                setEditMode(false);
              }}
            />
            <Button
              secondary
              label="Cancel"
              icon={<Close />}
              onClick={() => {
                setEditMode(false);
              }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
              primary
              label="Edit"
              icon={<Edit />}
              onClick={() => {
                setEditMode(true);
              }}
            />
            <Link to="/home">
              <Button primary label="Home" icon={<Home />} />
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const EditableField = ({ editMode, initialValue, fieldAlias, onChange }) => {
  return editMode ? (
    <Text>
      <b>{fieldAlias}</b>:{' '}
      <TextInput value={initialValue} onChange={onChange} />
    </Text>
  ) : (
    <Text>
      <b>{fieldAlias}</b>: {initialValue} <br />
    </Text>
  );
};

export default LeadEditor;
