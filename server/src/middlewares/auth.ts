import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../services/errors/AppError';
import logger from '../services/logger/winstonLogger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'client';
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    
    // Simple token validation - in real app, verify JWT
    if (token === 'admin_token') {
      req.user = { id: '1', role: 'admin' };
    } else if (token === 'client_token') {
      req.user = { id: '1', role: 'client' };
    } else {
      throw new UnauthorizedError('Invalid token');
    }

    logger.info(`User authenticated: ${req.user.role} - ${req.user.id}`);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }
  next();
};

export const requireClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'client') {
    return next(new UnauthorizedError('Client access required'));
  }
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === 'admin_token') {
      req.user = { id: '1', role: 'admin' };
    } else if (token === 'client_token') {
      req.user = { id: '1', role: 'client' };
    }
  }
  
  next();
};