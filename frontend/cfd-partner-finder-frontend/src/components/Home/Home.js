import {
  Box,
  Button,
  Heading,
  ResponsiveContext,
} from 'grommet';
import React, { useEffect, useState, useContext } from 'react';

import LeadCard from '../LeadCard/LeadCard';
import { Notification } from 'grommet-icons';
import QueryEditor from '../QueryEditor/QueryEditor';
import { config } from '../../config';
import dotenv from 'dotenv';
import { authContext } from '../../auth';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const AppBar = (props) => {
  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="between"
      background="brand"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      elevation="medium"
      style={{ zIndex: '1' }}
      {...props}
    />
  );
};

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
    perpage: 4,
  });
  const [leads, setLeads] = useState([]);
  const { authHeader } = useContext(authContext);

  // fetch leads data from api
  useEffect(() => {
    let headers = {
      Authorization: authHeader,
    }
    return fetch(
      `${config.backendHost}/leads?page=${query.page}&perpage=${query.perpage}&drop_null=false`, {
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((data) => setLeads(data.leads));
  }, [query]);

  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <Box fill>
          <AppBar>
            <Heading flex wrap level="3" margin="none">
              Code For Denver Partner Finder
            </Heading>
            <Button
              icon={<Notification />}
              onClick={() => {
                setShowSidebar(!showSidebar);
              }}
            />
          </AppBar>
            <QueryEditor query={query} onSubmit={setQuery} />
          <Box
            flex
            wrap
            direction="row"
            overflow={{ horizontal: 'hidden' }}
            basis="auto"
            gap="medium"
          >
            {/* app body */}
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
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
};

export default Home;
