var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DRUPAL_AUTH_URL = process.env.DRUPAL_AUTH_URL || 'https://rheumnow.com/api/auth/status';
const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';
/**
 * Middleware that verifies the Drupal session cookie before allowing access to protected routes.
 * Forwards the incoming Cookie header to the Drupal auth endpoint.
 * Set AUTH_ENABLED=false to bypass for local development.
 */
export function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
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
            const drupalRes = yield fetch(DRUPAL_AUTH_URL, {
                headers: {
                    Cookie: cookie,
                    Accept: 'application/json',
                },
            });
            if (!drupalRes.ok) {
                res.status(401).json({ error: 'Unauthorized', code: 'AUTH_ERROR' });
                return;
            }
            const data = (yield drupalRes.json());
            if (!data.authenticated) {
                res.status(401).json({ error: 'Unauthorized', code: 'NOT_AUTHENTICATED' });
                return;
            }
            if (!((_a = data.roles) === null || _a === void 0 ? void 0 : _a.includes('administrator'))) {
                res.status(403).json({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE' });
                return;
            }
            // Attach user info to request for downstream handlers
            req.user = data;
            next();
        }
        catch (_b) {
            res.status(401).json({ error: 'Unauthorized', code: 'AUTH_CHECK_FAILED' });
        }
    });
}
//# sourceMappingURL=auth.js.map