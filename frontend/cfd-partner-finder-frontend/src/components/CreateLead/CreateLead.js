import { Box, Button, Form, FormField, TextInput } from 'grommet';
import React, { useEffect, useState } from 'react';

import { config } from '../../config';

const CreateLead = () => {
  let [formData, setFormData] = useState({});

  const postLead = () => {
    const url = `${config.backendHost}/leads`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(
        setFormData({}) // TODO: change to redirect
      );
  };

  return (
    <Form
      value={formData}
      onChange={(x) => setFormData(x)}
      onReset={() => setFormData({})}
      onSubmit={() => postLead()}
    >
        <FormField name='company_name' htmlFor='company_name' label='Company'>
            <TextInput id='company_name' name='company_name'></TextInput>
        </FormField>
        <FormField name='company_address' htmlFor='company_address' label='Address'>
            <TextInput id='company_address' name='company_address'></TextInput>
        </FormField>
        <FormField name='formation_date' htmlFor='formation_date' label='Date Registered'>
            <TextInput id='formation_date' name='formation_date'></TextInput>
        </FormField>
        <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit"></Button>
            <Button type="reset" label="Reset"></Button>
        </Box>
    </Form>
  );
};

export default CreateLead;
