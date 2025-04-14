import { Router } from 'express';
import { questionRouter } from '../modules/question/question-routes.js';
import { adminRouter } from '../modules/admin/admin-router.js';
import { categoryRouter } from '../modules/category/category-routes.js';
import { abilityRouter } from '../modules/ablities/ability-routes.js';

export const router = Router();
router.use('/category', categoryRouter);
router.use('/question', questionRouter);
router.use('/admin', adminRouter);
router.use('/ability', abilityRouter);
