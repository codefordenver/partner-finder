import {
  Box,
  Button,
  Header,
  Heading,
  Spinner,
  Text,
  TextInput,
} from 'grommet';
import { Close, Edit, Home, Notification, Save } from 'grommet-icons';
import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { config } from '../../config';

const UPDATE_STATUS = {
  NO_UPDATE: 'NO_UPDATE',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const LeadDetail = ({ id }) => {
  const [lead, setLead] = useState({});
  const [updateStatus, setUpdateStatus] = useState(UPDATE_STATUS.NO_UPDATE);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const url = `${config.backendHost}/leads/${id}`;
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLead(data);
        setLoading(false);
        setUpdate(true);
      });
  }, [id]);

  useEffect(() => {
    if (update) {
      const url = `${config.backendHost}/leads/${id}`;
      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      }).then((res) => {
        if (res.ok) {
          setUpdateStatus(UPDATE_STATUS.SUCCESS);
        } else {
          setUpdateStatus(UPDATE_STATUS.FAILURE);
        }
      });
    }
  }, [lead, id]);

  return loading ? (
    <Spinner />
  ) : (
    <Box>
      {updateStatus !== UPDATE_STATUS.NO_UPDATE &&
        (updateStatus === UPDATE_STATUS.SUCCESS ? (
          <Header background="green">
            <Notification />
            <Heading>Update Successful!</Heading>
            <Button
              label="Close"
              icon={<Close />}
              onClick={() => setUpdateStatus(UPDATE_STATUS.NO_UPDATE)}
            />
          </Header>
        ) : (
          <Header background="red">
            <Notification />
            <Heading>Uh oh, something went wrong!</Heading>
          </Header>
        ))}

      <Heading background="">{lead.company_name}</Heading>
      <LeadEditor
        editMode={false}
        initFields={[
          {
            field: 'company_address',
            alias: 'Address',
            value: lead.company_address,
          },
          {
            field: 'contact_name',
            alias: 'Contact',
            value: lead.contact_name,
          },
          {
            field: 'email',
            alias: 'Email',
            value: lead.email,
          },
          {
            field: 'facebook',
            alias: 'Facebook',
            value: lead.facebook,
          },
          {
            field: 'formation_date',
            alias: 'Date Registered',
            value: lead.formation_date,
          },
          {
            field: 'phone',
            alias: 'Phone',
            value: lead.phone,
          },
          {
            field: 'twitter',
            alias: 'Twitter',
            value: lead.twitter,
          },
          {
            field: 'website',
            alias: 'Website',
            value: lead.website,
          },
          {
            field: 'last_email',
            alias: 'Last Email',
            value: lead.last_email,
          },
          {
            field: 'last_facebook_search',
            alias: 'Last Facebook Search',
            value: lead.last_facebook_search,
          },
          {
            field: 'last_google_search',
            alias: 'Last Google Search',
            value: lead.last_google_search,
          },
          {
            field: 'last_twitter_search',
            alias: 'Last Twitter Search',
            value: lead.last_twitter_search,
          },
          {
            field: 'last_linkedin_search',
            alias: 'Last LinkedIn Search',
            value: lead.last_linkedin_search,
          },
        ]}
        onSave={(fields) => {
          let updates = { company_name: lead.company_name };
          for (let i = 0; i < fields.length; i++) {
            updates[fields[i].field] = fields[i].value;
          }
          setLead(updates);
        }}
      />
    </Box>
  );
};

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
            <Link to="/">
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

export default LeadDetail;
