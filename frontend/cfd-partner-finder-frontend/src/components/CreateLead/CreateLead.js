import { Box, Button, Form, FormField, TextInput } from 'grommet';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { config } from '../../config';
import { authContext } from '../../auth';

const CreateLead = () => {
  let [formData, setFormData] = useState({});
  const { authHeader } = useContext(authContext);
  const history = useHistory();

  const postLead = () => {
    const url = `${config.backendHost}/leads`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(
        () => history.push('/home')
      )
      .catch(
        () => setFormData({})
      )
  };

  const renderFormField = ({name, label}) => {
    return (
      <FormField
        name={name}
        htmlFor={name}
        label={label}
      >
        <TextInput
          id={name}
          name={name}
        />
      </FormField>
    )
  }

  const fields = [
    {
      name: 'company_name',
      label: 'Company',
    },
    {
      name: 'company_address',
      label: 'Address'
    },
    {
      name: 'contact_name',
      label: 'Contact',
    },
    {
      name: 'formation_date',
      label: 'Date Formed',
    },
    {
      name: 'website',
      label: 'Website',
    },
    {
      name: 'phone',
      label: 'Phone',
    },
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'twitter',
      label: 'Twitter',
    },
    {
      name: 'facebook',
      label: 'Facebook',
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
    },
    {
      name: 'instagram',
      label: 'Instagram',
    },
    {
      name: 'mission_statement',
      label: 'Mission Statement',
    },
    {
      name: 'programs',
      label: 'Programs',
    },
    {
      name: 'populations_served',
      label: 'Populations Served',
    },
    {
      name: 'county',
      label: 'County',
    },
    {
      name: 'colorado_region',
      label: 'CO Region'
    },
  ]

  return (
    <Form
      value={formData}
      onChange={(x) => setFormData(x)}
      onReset={() => setFormData({})}
      onSubmit={() => postLead()}
    >

        { fields.map(renderFormField) }

        <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit"></Button>
            <Button type="reset" label="Reset"></Button>
        </Box>
    </Form>
  );
};

export default CreateLead;
