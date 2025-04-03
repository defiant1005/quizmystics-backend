import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../error/ApiError.js';
import { z, ZodError } from 'zod';
import { mapZodErrors } from '../../error/error-handler.js';

const questionSchema = z.object({
  title: z.string().min(3, 'Не менее 3 символов'),
  answer1: z.string().nonempty(),
  answer2: z.string().nonempty(),
  answer3: z.string().nonempty(),
  answer4: z.string().nonempty(),
  correct_answer: z.enum(['answer1', 'answer2', 'answer3', 'answer4'], {
    message: 'Выберите правильный ответ должен быть одним из четырх answer',
  }),
  categoryId: z.number().positive(),
});

export const validateQuestion = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = questionSchema.parse(req.body);
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
