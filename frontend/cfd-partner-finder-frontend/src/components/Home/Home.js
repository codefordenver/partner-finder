import {
  Box,
  Heading,
  Grid,
  Text,
  Button,
} from 'grommet';
import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Add } from 'grommet-icons';

import LeadCard from '../LeadCard/LeadCard';
import QueryEditor from '../QueryEditor/QueryEditor';
import { config } from '../../config';
import dotenv from 'dotenv';
import { authContext } from '../../auth';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const Home = () => {
  const [query, setQuery] = useState({
    page: 1,
    perpage: 4,
    search: "",
  });
  const [leads, setLeads] = useState([]);
  const [showQueryEditor, setShowQueryEditor] = useState(true);

  const { authHeader, currentUser } = useContext(authContext);

  // set query parameters for call to the backend service
  let url = `${config.backendHost}/leads?page=${query.page}&perpage=${query.perpage}&drop_null=false`

  if ( query.search ) {
    url = url + `&search=${query.search}`;
  }

  // fetch leads data from api
  useEffect(() => {
    let headers = {
      Authorization: authHeader,
    }
    return fetch(
      url, {
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((data) => setLeads(data.leads));
  }, [query]);


  return (
    <Grid
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >

      <Box
        gridArea="header"
        background="brand"
        tag="header"
        direction="row"
        align="center"
        justify="between"
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      >
        <Heading flex wrap level="3" margin="none">
          Code For Denver Partner Finder
        </Heading>
        <Text>
          {currentUser}
        </Text>
      </Box>

      <Box
        gridArea="sidebar"
      >
        {
          showQueryEditor && (
             <QueryEditor
              query={query}
              onSubmit={setQuery}
              hide={() => setShowQueryEditor(false)}
            />
          )
        }
      </Box>

      <Box
        gridArea="main"
      >

        <Box
          flex
          direction="row-reverse"
          pad="medium"
          gap="small"
          justify="between"
        >

          <Link to="/leads/create">
            <Button
              icon={< Add />}
              label={ "New" }
            />
          </Link>

          { !showQueryEditor && (
            <Button
              primary
              label="Query Editor"
              onClick={e => setShowQueryEditor(true)}
            />
          )}

        </Box>


        {leads &&
          leads.map((lead) => (
            <LeadCard
              id={lead.id}
              companyName={lead.company_name}
              formationDate={lead.formation_date}
              companyAddress={lead.company_address}
            />
          ))}

      </Box>
    </Grid>
  )
}

export default Home;
