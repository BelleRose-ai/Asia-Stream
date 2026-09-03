import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress unhandled third-party ad script / script errors
window.addEventListener('error', (event) => {
  if (!event.filename || event.filename.includes('profitableratecpmnetwork') || event.filename.includes('highrevenueformat')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

