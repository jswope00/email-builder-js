import { Request, Response, NextFunction } from 'express';

const DRUPAL_AUTH_URL = process.env.DRUPAL_AUTH_URL || 'https://rheumnow.com/api/auth/status';
const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';

/**
 * Middleware that verifies the Drupal session cookie before allowing access to protected routes.
 * Forwards the incoming Cookie header to the Drupal auth endpoint.
 * Set AUTH_ENABLED=false to bypass for local development.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!AUTH_ENABLED) {
    next();
    return;
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    res.status(401).json({ error: 'Unauthorized', code: 'NO_SESSION' });
    return;
  }

  try {
    const drupalRes = await fetch(DRUPAL_AUTH_URL, {
      headers: {
        Cookie: cookie,
        Accept: 'application/json',
      },
    });

    if (!drupalRes.ok) {
      res.status(401).json({ error: 'Unauthorized', code: 'AUTH_ERROR' });
      return;
    }

    const data = (await drupalRes.json()) as { authenticated: boolean; uid?: number; name?: string; roles?: string[] };

    if (!data.authenticated) {
      res.status(401).json({ error: 'Unauthorized', code: 'NOT_AUTHENTICATED' });
      return;
    }

    // Attach user info to request for downstream handlers
    (req as Request & { user: typeof data }).user = data;

    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', code: 'AUTH_CHECK_FAILED' });
  }
}
