import { ApiError } from '../error/ApiError.js';
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: { message: err.message } });
  } else {
    res.status(500).json({ error: { message: 'Непредвиденная ошибка' } });
  }
  next(err);
}
