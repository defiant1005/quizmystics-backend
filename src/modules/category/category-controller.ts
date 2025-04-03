import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../../error/error-handler.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from './category-service.js';

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(500).json({ error: `Ошибка при создании вопроса ${errorMessage}` });
  }
};

export const getAllCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(500).json({ error: `Ошибка при получении вопросов ${errorMessage}` });
  }
};

export const getCategoryByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await getCategoryById(Number(req.params.id));

    if (!category) {
      res.status(404).json({ error: 'Вопрос не найден' });
    } else {
      res.json(category);
    }

    next();
  } catch (error) {
    const errorMessage = errorHandler(error);
    res.status(500).json({ error: `Ошибка при получении вопроса: ${errorMessage}` });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await updateCategory(Number(req.params.id), req.body);
    if (!category) return res.status(404).json({ error: 'Вопрос не найден' });
    res.json(category);
  } catch (error) {
    const errorMessage = errorHandler(error);

    res.status(500).json({ error: `Ошибка при обновлении вопроса ${errorMessage}` });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = await deleteCategory(Number(req.params.id));
    if (!category) return res.status(404).json({ error: 'Вопрос не найден' });
    res.json({ message: 'Вопрос удален' });
  } catch (error) {
    const errorMessage = errorHandler(error);

    res.status(500).json({ error: `Ошибка при удалении вопроса ${errorMessage}` });
  }
};
