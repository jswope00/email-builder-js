import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { CircularProgress, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';

import App from './App';
import theme from './theme';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const LOGIN_URL = 'https://rheumnow.com/user/login';

type AuthStatus = 'checking' | 'authenticated' | 'redirecting' | 'forbidden';

function AuthGate({ children }: { children: React.ReactNode }) {
  // Skip auth when API not used; set initial state to avoid setState during render (would cause infinite re-renders)
  const [status, setStatus] = useState<AuthStatus>('authenticated');
  // useEffect(() => {
  //   fetch(`${API_URL}/auth/check`, { credentials: 'include' })
  //     .then((res) => {
  //       if (res.ok) {
  //         setStatus('authenticated');
  //       } else if (res.status === 403) {
  //         // Logged in but not an administrator
  //         setStatus('forbidden');
  //       } else {
  //         // Not logged in — send to Drupal login
  //         setStatus('redirecting');
  //         const destination = encodeURIComponent(window.location.href);
  //         window.location.href = `${LOGIN_URL}?mailbuilder=${destination}`;
  //       }
  //     })
  //     .catch(() => {
  //       setStatus('redirecting');
  //       const destination = encodeURIComponent(window.location.href);
  //       window.location.href = `${LOGIN_URL}?mailbuilder=${destination}`;
  //     });
  // }, []);

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  if (status === 'forbidden') {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh', gap: 1 }}>
        <Typography variant="h6">Access Denied</Typography>
        <Typography variant="body2" color="text.secondary">
          Your account does not have permission to use this tool.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh', gap: 2 }}>
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        {status === 'redirecting' ? 'Redirecting to login…' : 'Checking authentication…'}
      </Typography>
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthGate>
        <App />
      </AuthGate>
    </ThemeProvider>
  </React.StrictMode>
);
