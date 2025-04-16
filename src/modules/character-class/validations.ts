import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';

const characterClassSchema = z.object({
  title: z.string().min(3, 'Не менее 3 символов'),
  description: z.string().min(3, 'Не менее 3 символов'),
  luck: z.number().min(0, 'Удача не может быть меньше 0%').max(15, 'Удача не может быть больше 15%'),
  lives: z.number().min(1, 'Минимум 1 жизнь').max(3, 'Максимум 3 жизни'),
  abilities: z
    .array(
      z.object({
        abilityId: z.number().int().positive('ID способности должен быть положительным числом'),
        cooldown: z.number().int().min(0, 'Кулдаун не может быть меньше 0'),
      }),
    )
    .min(1, 'Нужно указать хотя бы одну способность')
    .max(3, 'Максимум 3 способности'),
});

export const validateCharacterClass = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = characterClassSchema.parse(req.body);
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
