import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../error/ApiError.js';
import { validateAccessToken } from '../modules/jwt/jwt-validate.js';
import { IAdminClientData } from '../modules/admin/types.js';

interface AuthenticatedRequest extends Request {
  user?: IAdminClientData;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.Unauthorized('Требуется авторизация'));
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.Unauthorized('Требуется авторизация'));
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.Unauthorized('Требуется авторизация'));
    }

    req.user = userData;

    next();
  } catch {
    return next(ApiError.Unauthorized('Требуется авторизация'));
  }
}
