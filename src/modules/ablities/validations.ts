import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';
import { AbilitySlug } from './types.js';

const abilitySchema = z.object({
  title: z.string().min(3, 'Не менее 3 символов'),
  description: z.string().min(3, 'Не менее 3 символов'),
  slug: z.nativeEnum(AbilitySlug),
});

export const validateAbility = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = abilitySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errors = mapZodErrors(error);
      next(ApiError.BadRequest(JSON.stringify(errors)));
    } else {
      next(error);
    }
  }
};
