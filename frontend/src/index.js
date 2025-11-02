/**
 * Application entry point.
 * 
 * This file is the first JavaScript file that runs when the React app starts.
 * It's responsible for mounting our main App component to the DOM.
 * 
 * React 18 uses createRoot instead of the older ReactDOM.render for improved
 * performance and to enable concurrent features like automatic batching.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';

// Get the root DOM element where our React app will be mounted
// This corresponds to <div id="root"></div> in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
// StrictMode is a development tool that highlights potential problems
// It runs additional checks and warnings, but only in development mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);