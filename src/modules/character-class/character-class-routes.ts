import { Router } from 'express';
import {
  createCharacterClassHandler,
  deleteCharacterClassHandler,
  getAllClassesHandler,
  getCharacterClassByIdHandler,
  updateCharacterClassHandler,
} from './character-class-controller.js';
import { validateCharacterClass } from './validations.js';
import { superAdminMiddleware } from '../../middleware/super-admin-middleware.js';

export const characterClass = Router();

characterClass.get('/', getAllClassesHandler);
characterClass.get('/:id', getCharacterClassByIdHandler);

characterClass.post('/', validateCharacterClass, superAdminMiddleware, createCharacterClassHandler);

characterClass.put('/:id', validateCharacterClass, superAdminMiddleware, updateCharacterClassHandler);
characterClass.delete('/:id', superAdminMiddleware, deleteCharacterClassHandler);
