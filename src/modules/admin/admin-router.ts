import { Router } from 'express';
import { auth, login, registration } from './admin-controller.js';

export const adminRouter = Router();

adminRouter.post('/registration', registration);

adminRouter.post('/login', login);

adminRouter.get('/auth', auth);
