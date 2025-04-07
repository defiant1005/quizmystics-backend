import { Router } from 'express';
import { createAdminHandler } from './admin-controller.js';
import { validateAdmin } from './validations.js';

export const adminRouter = Router();

adminRouter.post('/registration', validateAdmin, createAdminHandler);

// adminRouter.post('/login', login);
//
// adminRouter.get('/auth', auth);
