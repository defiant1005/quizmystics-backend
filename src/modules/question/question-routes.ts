import { Router } from 'express';
import {
  createQuestionHandler,
  getAllQuestionsHandler,
  getQuestionByIdHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
} from './question-controller.js';
import { validateQuestion } from './validations.js';

export const questionRouter = Router();

questionRouter.get('/', getAllQuestionsHandler);
questionRouter.get('/:id', getQuestionByIdHandler);

questionRouter.post('/', validateQuestion, createQuestionHandler);

questionRouter.put('/:id', updateQuestionHandler as any);
questionRouter.delete('/:id', deleteQuestionHandler as any);
