import {
  Box,
  Heading,
  Grid,
  Text,
} from 'grommet';
import React, { useEffect, useState, useContext } from 'react';

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
        <QueryEditor query={query} onSubmit={setQuery} />
      </Box>

      <Box
        gridArea="main"
      >
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
