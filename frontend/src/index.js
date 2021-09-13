import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

dotenv.config();

ReactDOM.render(<App />, document.getElementById('root'));
