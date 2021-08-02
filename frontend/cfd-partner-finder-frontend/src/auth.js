import { createContext } from 'react';

export const authContext = createContext({
  token: '',
  setToken: function (t) {
    this.token = t;
  },
  authHeader: 'Bearer ',
  currentUser: 'useruser@gmail.com',
});
