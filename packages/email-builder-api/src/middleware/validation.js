import { ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
/**
 * Middleware to validate request body against a Zod schema
 */
export function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(new ValidationError('Invalid request body', error.errors));
            }
            else {
                next(error);
            }
        }
    };
}
/**
 * Middleware to validate request params
 */
export function validateParams(schema) {
    return (req, res, next) => {
        try {
            req.params = schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(new ValidationError('Invalid request parameters', error.errors));
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validation.js.map