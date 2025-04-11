import { NextFunction, Response, Request } from 'express';
import { ApiError } from '../error/ApiError.js';
import { validateAccessToken } from '../modules/jwt/jwt-validate.js';
import { AdminRole } from '../modules/admin/types.js';

export function superAdminMiddleware(req: Request, res: Response, next: NextFunction): void {
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

    if (userData.role !== AdminRole.SUPER_ADMIN) {
      return next(ApiError.Unauthorized('Нет прав доступа'));
    }

    req.user = userData;

    next();
  } catch {
    return next(ApiError.Unauthorized('Требуется авторизация'));
  }
}
