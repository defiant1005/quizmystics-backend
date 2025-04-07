import { NextFunction, Request, Response } from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from './question-service.js';
import { errorHandler } from '../../error/error-handler.js';
import { ApiError } from '../../error/ApiError.js';

export const createQuestionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании вопроса ${errorMessage}`));
  }
};

export const getAllQuestionsHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`${errorMessage}`));
  }
};

export const getQuestionByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await getQuestionById(Number(req.params.id));

    if (!question) {
      next(ApiError.BadRequest(`Вопрос не найден`));
    } else {
      res.json(question);
    }

    next();
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении вопроса: ${errorMessage}`));
  }
};

export const updateQuestionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await updateQuestion(Number(req.params.id), req.body);
    if (!question) {
      next(ApiError.BadRequest('Вопрос не найден'));
    } else {
      res.json(question);
    }
  } catch (error) {
    const errorMessage = errorHandler(error);

    next(ApiError.Internal(`Ошибка при обновлении вопроса ${errorMessage}`));
  }
};

export const deleteQuestionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await deleteQuestion(Number(req.params.id));
    if (!question) {
      next(ApiError.BadRequest('Вопрос не найден'));
    } else {
      res.json({ message: 'Вопрос удален' });
    }
  } catch (error) {
    const errorMessage = errorHandler(error);

    next(ApiError.Internal(`Ошибка при удалении вопроса ${errorMessage}`));
  }
};
