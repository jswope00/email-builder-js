import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { getMainDomainOrigin, useAuth } from './useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Base domain for redirect to login page.
   * If not set, derived from current host
   * (e.g. email-builder.example.com → example.com).
   */
  baseDomain?: string;
}

/**
 * Route guard component.
 * Checks for cookie email_builder_pass = 1.
 * If missing, redirects to base_domain/user/login.
 */
export default function AuthGuard({ children, baseDomain }: AuthGuardProps) {
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Use provided base domain or derive from current host (strip subdomain)
      const domain = baseDomain ?? getMainDomainOrigin();
      const loginUrl = `${domain}/user/login?mailbuilder=1`;

      // Debug: redirect URL
      console.log('[AuthGuard] redirect debug:', { baseDomain, domain, loginUrl, isAuthenticated });

      // Redirect to login page (currently disabled)
      window.location.href = loginUrl;
    }
  }, [isAuthenticated, baseDomain]);

  // Show loading while checking auth or redirecting
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Checking authorization...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

