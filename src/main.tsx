import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import xior from 'xior';

import '@mantine/core/styles.css';

import './config/i18n.ts';
import { getAuthToken } from '#services/auth';

import App from './App.tsx';

xior.defaults.baseURL = import.meta.env.VITE_API_URL;
xior.defaults.headers['Authorization'] = `Bearer ${getAuthToken()}`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='auto'>
      <App />
    </MantineProvider>
  </StrictMode>,
);
