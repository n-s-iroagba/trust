import { Request, Response, NextFunction } from 'express';
import { AppError } from '../services/errors/AppError';
import logger from '../services/logger/winstonLogger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    logger.warn(`AppError: ${error.message}`, { statusCode: error.statusCode });
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: (error as any).errors || [],
    });
  }

  logger.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};