import { Router } from 'express';
import { questionRouter } from '../modules/question/question-routes.js';
import { adminRouter } from '../modules/admin/admin-router.js';
import { categoryRouter } from '../modules/category/category-routes.js';
import { abilityRouter } from '../modules/ablities/ability-routes.js';
import { characterClass } from '../modules/character-class/character-class-routes.js';

export const router = Router();
router.use('/category', categoryRouter);
router.use('/question', questionRouter);
router.use('/admin', adminRouter);
router.use('/ability', abilityRouter);
router.use('/character-class', characterClass);
