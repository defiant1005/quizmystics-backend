import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';

const categorySchema = z.object({
  title: z.string().min(3, 'Не менее 3 символов'),
});

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = categorySchema.parse(req.body);
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
