import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from '../../services/errors/AppError';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      next(new AppError('Validation failed', 400, errors));
    }
  };
};