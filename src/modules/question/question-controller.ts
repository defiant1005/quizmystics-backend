import { Request, Response } from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from './question-service.js';
import { errorHandler } from '../../error/error-handler.js';

export const createQuestionHandler = async (req: Request, res: Response) => {
  try {
    const question = await createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(500).json({ error: `Ошибка при создании вопроса ${errorMessage}` });
  }
};

export const getAllQuestionsHandler = async (_req: Request, res: Response) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(500).json({ error: `Ошибка при получении вопросов ${errorMessage}` });
  }
};

export const getQuestionByIdHandler = async (req: Request, res: Response) => {
  try {
    const question = await getQuestionById(Number(req.params.id));
    if (!question) return res.status(404).json({ error: 'Вопрос не найден' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении вопроса' });
  }
};

export const updateQuestionHandler = async (req: Request, res: Response) => {
  try {
    const question = await updateQuestion(Number(req.params.id), req.body);
    if (!question) return res.status(404).json({ error: 'Вопрос не найден' });
    res.json(question);
  } catch (error) {
    const errorMessage = errorHandler(error);

    res.status(500).json({ error: `Ошибка при обновлении вопроса ${errorMessage}` });
  }
};

export const deleteQuestionHandler = async (req: Request, res: Response) => {
  try {
    const question = await deleteQuestion(Number(req.params.id));
    if (!question) return res.status(404).json({ error: 'Вопрос не найден' });
    res.json({ message: 'Вопрос удален' });
  } catch (error) {
    const errorMessage = errorHandler(error);

    res.status(500).json({ error: `Ошибка при удалении вопроса ${errorMessage}` });
  }
};
