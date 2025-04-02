import { Router } from 'express';
import {
  createQuestionHandler,
  getAllQuestionsHandler,
  getQuestionByIdHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
} from './question-controller.js';
import { validateQuestion } from './validations.js';

const router = Router();

router.post('/questions', validateQuestion, createQuestionHandler);
router.get('/', getAllQuestionsHandler);
router.get('/:id', getQuestionByIdHandler as any);
router.put('/:id', updateQuestionHandler as any);
router.delete('/:id', deleteQuestionHandler as any);

export default router;
