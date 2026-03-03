var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
const router = Router();
const DRUPAL_AUTH_URL = process.env.DRUPAL_AUTH_URL || 'https://rheumnow.com/api/auth/status';
//const AUTH_ENABLED = process.env.AUTH_ENABLED !== 'false';
const AUTH_ENABLED = false;
/**
 * GET /api/auth/check
 * Forwards the incoming session cookie to Drupal and returns 200 if authenticated, 401 if not.
 * Set AUTH_ENABLED=false to bypass for local development.
 */
router.get('/check', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const drupalRes = yield fetch(DRUPAL_AUTH_URL, {
            headers: {
                Cookie: cookie,
                Accept: 'application/json',
            },
        });
        if (!drupalRes.ok) {
            res.status(401).json({ authenticated: false, error: 'Drupal auth endpoint error' });
            return;
        }
        const data = (yield drupalRes.json());
        if (!data.authenticated || !((_a = data.roles) === null || _a === void 0 ? void 0 : _a.includes('administrator'))) {
            res.status(401).json({ authenticated: (_b = data.authenticated) !== null && _b !== void 0 ? _b : false, authorized: false });
            return;
        }
        res.status(200).json({
            authenticated: true,
            authorized: true,
            uid: data.uid,
            name: data.name,
            roles: data.roles,
        });
    }
    catch (_c) {
        res.status(401).json({ authenticated: false, error: 'Auth check failed' });
    }
}));
export default router;
//# sourceMappingURL=auth.js.map