import { Router, Request, Response, type IRouter } from 'express';

const router: IRouter = Router();

const DRUPAL_AUTH_URL = process.env.DRUPAL_AUTH_URL || 'https://rheumnow.com/api/auth/status';
//const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';
const AUTH_ENABLED = false;

/**
 * GET /api/auth/check
 * Forwards the incoming session cookie to Drupal and returns 200 if authenticated, 401 if not.
 * Set AUTH_ENABLED=false to bypass for local development.
 */
router.get('/check', async (req: Request, res: Response) => {
  if (!AUTH_ENABLED) {
    res.status(200).json({ authenticated: true, uid: 0, name: 'local-dev', roles: ['administrator'] });
    return;
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    res.status(401).json({ authenticated: false, error: 'No session cookie' });
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
      res.status(401).json({ authenticated: false, error: 'Drupal auth endpoint error' });
      return;
    }

    const data = (await drupalRes.json()) as {
      authenticated: boolean;
      uid?: number;
      name?: string;
      roles?: string[];
    };

    if (!data.authenticated || !data.roles?.includes('administrator')) {
      res.status(401).json({ authenticated: data.authenticated ?? false, authorized: false });
      return;
    }

    res.status(200).json({
      authenticated: true,
      authorized: true,
      uid: data.uid,
      name: data.name,
      roles: data.roles,
    });
  } catch {
    res.status(401).json({ authenticated: false, error: 'Auth check failed' });
  }
});

export default router;
