import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import xior from 'xior';

import App from './App.tsx';

xior.defaults.baseURL = import.meta.env.VITE_API_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
