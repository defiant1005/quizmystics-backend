import { Router } from 'express';
import { questionRouter } from '../modules/question/question-routes.js';
import { adminRouter } from '../modules/admin/admin-router.js';

export const router = Router();
router.use('/question', questionRouter);
router.use('/admin', adminRouter);
