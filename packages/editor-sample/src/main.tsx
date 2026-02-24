import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { CircularProgress, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';

import App from './App';
import theme from './theme';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const LOGIN_URL = 'https://rheumnow.com/user/login';

function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'redirecting'>('checking');

  useEffect(() => {
    fetch(`${API_URL}/auth/check`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setStatus('authenticated');
        } else {
          setStatus('redirecting');
          const destination = encodeURIComponent(window.location.href);
          window.location.href = `${LOGIN_URL}?destination=${destination}`;
        }
      })
      .catch(() => {
        setStatus('redirecting');
        const destination = encodeURIComponent(window.location.href);
        window.location.href = `${LOGIN_URL}?destination=${destination}`;
      });
  }, []);

  if (status === 'authenticated') {
    return <>{children}</>;
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
