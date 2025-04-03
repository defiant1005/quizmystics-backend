import { Router } from 'express';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from './category-controller.js';

import { validateCategory } from './validations.js';

export const categoryRouter = Router();

categoryRouter.get('/', getAllCategoriesHandler);
categoryRouter.get('/:id', getCategoryByIdHandler);

categoryRouter.post('/', validateCategory, createCategoryHandler);

categoryRouter.put('/:id', validateCategory, updateCategoryHandler);
categoryRouter.delete('/:id', deleteCategoryHandler);
