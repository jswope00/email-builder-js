var _a;
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CircularProgress, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import App from './App';
import theme from './theme';
const API_URL = (_a = import.meta.env.VITE_API_URL) !== null && _a !== void 0 ? _a : '/api';
const LOGIN_URL = 'https://rheumnow.com/user/login';
function AuthGate({ children }) {
    // Skip auth when API not used; set initial state to avoid setState during render (would cause infinite re-renders)
    const [status, setStatus] = useState('authenticated');
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
        return React.createElement(React.Fragment, null, children);
    }
    if (status === 'forbidden') {
        return (React.createElement(Stack, { alignItems: "center", justifyContent: "center", sx: { height: '100vh', gap: 1 } },
            React.createElement(Typography, { variant: "h6" }, "Access Denied"),
            React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Your account does not have permission to use this tool.")));
    }
    return (React.createElement(Stack, { alignItems: "center", justifyContent: "center", sx: { height: '100vh', gap: 2 } },
        React.createElement(CircularProgress, { size: 32 }),
        React.createElement(Typography, { variant: "body2", color: "text.secondary" }, status === 'redirecting' ? 'Redirecting to login…' : 'Checking authentication…')));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null,
    React.createElement(ThemeProvider, { theme: theme },
        React.createElement(CssBaseline, null),
        React.createElement(AuthGate, null,
            React.createElement(App, null)))));
//# sourceMappingURL=main.js.map