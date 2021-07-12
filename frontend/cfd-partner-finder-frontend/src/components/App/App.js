import {
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import CreateLead from '../CreateLead/CreateLead';
import { Grommet } from 'grommet';
import Home from '../Home/Home';
import LeadDetail from '../LeadDetail/LeadDetail';
import Login from '../Login/Login';
import React, { useState, useContext, Fragment } from 'react';
import { authContext } from '../../auth';

const theme = {
  global: {
    colors: {
      brand: '#e14e54',
      secondary: '#grey',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const App = () => {
  const [token, setToken] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  const authHeader = `Bearer ${token}`;

  return (
    <authContext.Provider
      value={{ token, setToken, authHeader, currentUser, setCurrentUser }}
    >
      <Grommet theme={theme} full>
        <Router>
          <Switch>
            <Route path="/leads/create">
              <TokenRequired>
                <CreateLead />
              </TokenRequired>
            </Route>
            <Route path="/leads">
              <TokenRequired>
                <Leads />
              </TokenRequired>
            </Route>
            <Route path="/home">
              <TokenRequired>
                <Home />
              </TokenRequired>
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">{token ? <Home /> : <Login />}</Route>
          </Switch>
        </Router>
      </Grommet>
    </authContext.Provider>
  );
};

const Leads = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:id`}>
        <Lead />
      </Route>
    </Switch>
  );
};

const Lead = () => {
  const { id } = useParams();
  return <LeadDetail key={`lead-detail-${id}`} id={id} />;
};

const TokenRequired = (props) => {
  const { token } = useContext(authContext);
  return <Fragment>{token ? props.children : <Login />}</Fragment>;
};

export default App;
