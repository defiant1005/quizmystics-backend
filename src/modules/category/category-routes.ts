import { Router } from 'express';
import {
  createQuestionHandler,
  getAllQuestionsHandler,
  getQuestionByIdHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
} from './question-controller.js';
import { validateQuestion } from './validations.js';

export const categoryRouter = Router();

categoryRouter.get('/', getAllQuestionsHandler);
categoryRouter.get('/:id', getQuestionByIdHandler);

categoryRouter.post('/', validateQuestion, createQuestionHandler);

categoryRouter.put('/:id', updateQuestionHandler as any);
categoryRouter.delete('/:id', deleteQuestionHandler as any);
