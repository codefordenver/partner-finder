import React, { useEffect } from 'react';

import { useHistory, Route } from 'react-router-dom';

import { API_HOST } from '../config';

const userLoggedIn = async () => {
  const token = localStorage.getItem('partnerFinderToken');
  const url = `http://${API_HOST}/authorize`;
  if (token) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const status = await response.status;
    return status === 200;
  }
  return false;
};

export default function ProtectedRoute({ path, children }) {
  const history = useHistory();

  useEffect(() => {
    if (!userLoggedIn()) {
      history.push('/login');
    }
  });

  return <Route path={path}>{children}</Route>;
}
