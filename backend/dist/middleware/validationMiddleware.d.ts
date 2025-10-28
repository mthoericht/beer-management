import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare function validateBody<T>(schema: z.ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateParams<T>(schema: z.ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateQuery<T>(schema: z.ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validationMiddleware.d.ts.map