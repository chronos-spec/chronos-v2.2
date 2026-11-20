import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Polices hébergées avec le site (et non chez Google) : aucune adresse IP de visiteur n'est envoyée à un tiers.
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './theme.css';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
