import { Router } from 'express';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from './category-controller.js';

import { validateCategory } from './validations.js';
import { superAdminMiddleware } from '../../middleware/super-admin-middleware.js';

export const categoryRouter = Router();

categoryRouter.get('/', getAllCategoriesHandler);
categoryRouter.get('/:id', getCategoryByIdHandler);

categoryRouter.post('/', validateCategory, superAdminMiddleware, createCategoryHandler);

categoryRouter.put('/:id', validateCategory, superAdminMiddleware, updateCategoryHandler);
categoryRouter.delete('/:id', superAdminMiddleware, deleteCategoryHandler);
