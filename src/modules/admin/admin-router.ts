import { Router } from 'express';
import { createAdminHandler, loginAdminHandler } from './admin-controller.js';
import { validateCreateAdmin, validateLoginAdmin } from './validations.js';

export const adminRouter = Router();

adminRouter.post('/registration', validateCreateAdmin, createAdminHandler);

adminRouter.post('/login', validateLoginAdmin, loginAdminHandler);
//
// adminRouter.get('/auth', auth);
