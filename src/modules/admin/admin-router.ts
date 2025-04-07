import { Router } from 'express';
import { createAdminHandler, loginAdminHandler, logoutHandler } from './admin-controller.js';
import { validateCreateAdmin, validateLoginAdmin, validateLogoutAdmin } from './validations.js';

export const adminRouter = Router();

adminRouter.post('/registration', validateCreateAdmin, createAdminHandler);

adminRouter.post('/login', validateLoginAdmin, loginAdminHandler);
//
adminRouter.post('/logout', validateLogoutAdmin, logoutHandler);
