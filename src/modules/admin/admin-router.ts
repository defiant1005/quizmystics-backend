import { Router } from 'express';
import { createAdminHandler, loginAdminHandler, logoutHandler, refreshTokenHandler } from './admin-controller.js';
import { validateCreateAdmin, validateIsHasRefresh, validateLoginAdmin } from './validations.js';

export const adminRouter = Router();

adminRouter.post('/registration', validateCreateAdmin, createAdminHandler);

adminRouter.post('/login', validateLoginAdmin, loginAdminHandler);
//
adminRouter.post('/logout', validateIsHasRefresh, logoutHandler);

adminRouter.post('/refresh', validateIsHasRefresh, refreshTokenHandler);
