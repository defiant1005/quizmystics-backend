import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../../error/error-handler.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from './category-service.js';
import { ApiError } from '../../error/ApiError.js';

export const createCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании категории ${errorMessage}`));
  }
};

export const getAllCategoriesHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении категории ${errorMessage}`));
  }
};

export const getCategoryByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await getCategoryById(Number(req.params.id));

    if (!category) {
      next(ApiError.BadRequest('Категория не найдена'));
    } else {
      res.json(category);
    }

    next();
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении категории ${errorMessage}`));
  }
};

export const updateCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await updateCategory(Number(req.params.id), req.body);
    if (!category) {
      next(ApiError.BadRequest('Категория не найдена'));
    }
    res.json(category);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении категории ${errorMessage}`));
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await deleteCategory(Number(req.params.id));
    if (!category) {
      next(ApiError.BadRequest('Категория не найдена'));
    }

    res.json({ message: 'Вопрос удален' });
  } catch (error) {
    const errorMessage = errorHandler(error);

    next(ApiError.Internal(`Ошибка при удалении категории ${errorMessage}`));
  }
};
