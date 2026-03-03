import { Request, Response, NextFunction } from 'express';
/**
 * Middleware that verifies the Drupal session cookie before allowing access to protected routes.
 * Forwards the incoming Cookie header to the Drupal auth endpoint.
 * Set AUTH_ENABLED=false to bypass for local development.
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map