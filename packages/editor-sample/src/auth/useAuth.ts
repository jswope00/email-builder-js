import { useEffect, useState } from 'react';

/**
 * Hook to check auth via cookie email_builder_pass.
 * @returns {boolean} true if user is authenticated (cookie = "1"), false otherwise.
 */
export function useAuth(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const emailBuilderPassCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('email_builder_pass=')
      );

      if (emailBuilderPassCookie) {
        const value = emailBuilderPassCookie.split('=')[1]?.trim();
        setIsAuthenticated(value === '1');
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check immediately
    checkAuth();

    // Re-check on window focus (e.g. if cookie changed in another tab)
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return isAuthenticated;
}

/**
 * Derives base domain from current host (strips subdomain).
 * E.g. email-builder.example.com → https://example.com
 */
export function getMainDomainOrigin(): string {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  const parts = hostname.split('.');
  const mainHost = parts.length > 2 ? parts.slice(1).join('.') : hostname;
  const result = `${protocol}//${mainHost}`;
  console.log('getMainDomainOrigin returning', result);
  return result;
}

/**
 * Get cookie value by name.
 * @param name - cookie name
 * @returns cookie value or null
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1]?.trim() || null : null;
}

