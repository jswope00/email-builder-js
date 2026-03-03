import { ZodError } from 'zod';
export class AppError extends Error {
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        this.name = 'AppError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource, identifier) {
        super(404, identifier ? `${resource} with ${identifier} not found` : `${resource} not found`, 'NOT_FOUND');
    }
}
export class ValidationError extends AppError {
    constructor(message, errors) {
        super(400, message, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(409, message, 'CONFLICT');
    }
}
// Error handling middleware
export function errorHandler(err, req, res, next) {
    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            code: 'VALIDATION_ERROR',
            details: err.errors,
        });
    }
    // Custom AppError
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code || 'ERROR',
        });
    }
    // Unknown errors
    console.error('Unhandled error:', err);
    return res.status(500).json({
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
}
//# sourceMappingURL=errors.js.map