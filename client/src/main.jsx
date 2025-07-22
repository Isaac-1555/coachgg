import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import your custom CSS files
import './styles/variables.css'; // Variables must be available globally
import './styles/main.css';      // Other global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);