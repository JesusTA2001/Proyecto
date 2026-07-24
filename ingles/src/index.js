import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Build: 2026-02-02 - Fix variables de entorno Azure

// Deshabilitar console.log y console.info en producción por seguridad
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

