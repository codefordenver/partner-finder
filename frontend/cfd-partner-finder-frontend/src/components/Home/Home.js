import {
  Box,
  Heading,
  Grid,
  Text,
  TextInput,
  Button,
  Accordion,
  AccordionPanel,
} from 'grommet';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Add, Edit, Save, ClearOption, Rewind } from 'grommet-icons';

import QueryEditor from '../QueryEditor/QueryEditor';
import { config } from '../../config';
import dotenv from 'dotenv';
import { authContext } from '../../auth';
import Header from '../Header/Header';
import EditableInput from '../EditableInput/EditableInput';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const Home = () => {
  const [query, setQuery] = useState({
    page: 1,
    perpage: 10,
    search: '',
  });
  const [leads, setLeads] = useState([]);
  const [showQueryEditor, setShowQueryEditor] = useState(true);
  const [editMode, setEditMode] = useState(-1);

  const { authHeader } = useContext(authContext);

  // set query parameters for call to the backend service
  let url = `${config.backendHost}/leads?page=${query.page}&perpage=${query.perpage}&drop_null=false`;

  if (query.search) {
    url = url + `&search=${query.search}`;
  }

  // fetch leads data from api
  useEffect(() => {
    let headers = {
      Authorization: authHeader,
    };
    return fetch(url, {
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => setLeads(data.leads));
  }, [query]);

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Box gridArea="header">
        <Header />
      </Box>

      <Box gridArea="sidebar">
        {showQueryEditor && (
          <QueryEditor
            query={query}
            onSubmit={setQuery}
            hide={() => setShowQueryEditor(false)}
          />
        )}
      </Box>

      <Box
        gridArea="main"
        flex
        direction="column"
        justify="start"
        overflow={{
          vertical: 'scroll',
        }}
      >
        <Accordion>
          <Box
            flex="grow"
            direction="row-reverse"
            pad="medium"
            gap="small"
            justify="between"
            border="bottom"
          >
            <Link to="/leads/create">
              <Button icon={<Add />} label={'New'} />
            </Link>

            {!showQueryEditor && (
              <Button
                primary
                label="Query Editor"
                onClick={(e) => setShowQueryEditor(true)}
              />
            )}
          </Box>

          {leads.map((lead, i) => {
            const leadInEditMode = (editMode > -1) && (editMode === i);
            const updateLead = field => e => {
              let newLead = JSON.parse(JSON.stringify(lead));
              newLead[field] = e.target.value;
              let newLeads = JSON.parse(JSON.stringify(leads));
              newLeads[i] = newLead;
              setLeads(newLeads);
            }
            return (
              <AccordionPanel
                label={
                  <Box
                    flex
                    direction="row"
                    pad="small"
                    justify="between"
                    align="center"
                  >
                    <Heading level={2} size="small">
                      {lead.company_name}
                    </Heading>
                  </Box>
                }
              >
                <Box flex direction="column" pad="medium" height="large">
                  <EditableInput
                    editMode={leadInEditMode}
                    lead={lead}
                    field={"company_address"}
                    alias={"Address"}
                    onChange={updateLead('company_address')}
                  />
                  <EditableInput
                    editMode={leadInEditMode}
                    lead={lead}
                    field={"contact_name"}
                    alias={"Contact"}
                    onChange={updateLead('contact_name')}
                  />
                  <Text>
                    <b>Email: </b> {lead.email}
                  </Text>
                  <Text>
                    <b>Facebook: </b> {lead.facebook}
                  </Text>
                  <Text>
                    <b>Phone: </b> {lead.phone}
                  </Text>
                  <Text>
                    <b>Twitter: </b> {lead.twitter}
                  </Text>
                  <Text>
                    <b>Website: </b> {lead.website}
                  </Text>
                  <Text>
                    <b>LinkedIn: </b> {lead.linkedin}
                  </Text>
                </Box>
                {
                  // TODO: change onClick handler to actually save, edit, reset, back
                  editMode > -1 && editMode === i ? (
                    <Fragment>
                      <Button
                        secondary
                        label="Save"
                        icon={<Save />}
                        onClick={() => setEditMode(-1)}
                      />
                      <Button
                        secondary
                        label="Clear"
                        icon={<ClearOption />}
                        onClick={() => setEditMode(-1)}
                      />
                      <Button
                        secondary
                        label="Back"
                        icon={<Rewind />}
                        onClick={() => setEditMode(-1)}
                      />
                    </Fragment>
                  ) : (
                    <Button
                      secondary
                      label="Edit"
                      icon={<Edit />}
                      onClick={() => setEditMode(i)}
                    />
                  )
                }
              </AccordionPanel>
            );
          })}
        </Accordion>
      </Box>
    </Grid>
  );
};

export default Home;
