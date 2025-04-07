import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';
import { AdminRole } from './types.js';

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Не менее 8 символов'),
  role: z.nativeEnum(AdminRole),
});

const loginAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Не менее 8 символов'),
});

const isHasRefresh = z.object({
  refreshToken: z.string(),
});

export const validateCreateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createAdminSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errors = mapZodErrors(error);
      next(ApiError.badRequest(JSON.stringify(errors)));
    } else {
      next(error);
    }
  }
};

export const validateLoginAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = loginAdminSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errors = mapZodErrors(error);
      next(ApiError.badRequest(JSON.stringify(errors)));
    } else {
      next(error);
    }
  }
};

export const validateIsHasRefresh = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = isHasRefresh.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errors = mapZodErrors(error);
      next(ApiError.badRequest(JSON.stringify(errors)));
    } else {
      next(error);
    }
  }
};
