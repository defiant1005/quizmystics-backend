import { Router } from 'express';
import {
  createAbilityHandler,
  deleteAbilityHandler,
  getAbilityByIdHandler,
  getAllAbilitiesHandler,
  updateAbilityHandler,
} from './ability-controller.js';
import { validateAbility } from './validations.js';
import { superAdminMiddleware } from '../../middleware/super-admin-middleware.js';

export const abilityRouter = Router();

abilityRouter.get('/', getAllAbilitiesHandler);
abilityRouter.get('/:id', getAbilityByIdHandler);

abilityRouter.post('/', validateAbility, superAdminMiddleware, createAbilityHandler);

abilityRouter.put('/:id', validateAbility, superAdminMiddleware, updateAbilityHandler);
abilityRouter.delete('/:id', superAdminMiddleware, deleteAbilityHandler);
