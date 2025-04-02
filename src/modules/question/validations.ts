import { z } from 'zod';

const questionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  answer1: z.string().nonempty(),
  answer2: z.string().nonempty(),
  answer3: z.string().nonempty(),
  answer4: z.string().nonempty(),
  correct_answer: z.enum(['answer1', 'answer2', 'answer3', 'answer4']),
});

export const validateQuestion = (req: any, res: any, next: any) => {
  try {
    req.body = questionSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};
