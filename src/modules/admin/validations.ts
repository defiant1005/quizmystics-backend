import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';
import { AdminRole } from './types.js';

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Не менее 8 символов'),
  role: z.nativeEnum(AdminRole),
});

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = adminSchema.parse(req.body);
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
