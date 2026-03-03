import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Middleware to validate request body against a Zod schema
 */
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to validate request params
 */
export declare function validateParams(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map