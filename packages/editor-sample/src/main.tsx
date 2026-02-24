import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import AuthGuard from './auth/AuthGuard';
import theme from './theme';

// Base domain for login redirect (if set in env).
// Otherwise AuthGuard derives it from current host (subdomain → base domain).
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || undefined;
console.log('baseDomain', BASE_DOMAIN);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthGuard baseDomain={BASE_DOMAIN}>
        <App />
      </AuthGuard>
    </ThemeProvider>
  </React.StrictMode>
);
