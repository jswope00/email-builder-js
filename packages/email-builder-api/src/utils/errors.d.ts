import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export declare class AppError extends Error {
    statusCode: number;
    message: string;
    code?: string | undefined;
    constructor(statusCode: number, message: string, code?: string | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, identifier?: string);
}
export declare class ValidationError extends AppError {
    errors?: any | undefined;
    constructor(message: string, errors?: any | undefined);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare function errorHandler(err: Error | AppError | ZodError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
//# sourceMappingURL=errors.d.ts.map