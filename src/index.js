import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { DonationsProvider } from './context/DonationsContext';

ReactDOM.render(
  <DonationsProvider>
    <App />
  </DonationsProvider>,
  document.getElementById('root')
);
