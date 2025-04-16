import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../../error/error-handler.js';
import { ApiError } from '../../error/ApiError.js';
import {
  createCharacterClass,
  deleteCharacterClass,
  getAllCharacterClassAbilities,
  getAllCharacterClasses,
  getCharacterClassById,
  updateCharacterClass,
} from './character-class-service.js';
import { ICharacterClassClientData } from './types.js';

export const createCharacterClassHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createCharacterClass(req.body);

    res.status(201).json({
      data: {
        message: 'ok',
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании класса ${errorMessage}`));
  }
};

export const getAllClassesHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [classes, abilities] = await Promise.all([getAllCharacterClasses(), getAllCharacterClassAbilities()]);

    const clientData: Array<ICharacterClassClientData> = classes.map((charClass) => {
      const classAbilities = abilities
        .filter((ability) => ability.characterClassId === charClass.id)
        .map((ability) => ({
          abilityId: ability.abilityId,
          cooldown: ability.cooldown,
        }));

      return {
        id: charClass.id,
        title: charClass.title,
        description: charClass.description,
        lives: charClass.lives,
        luck: charClass.luck,
        abilities: classAbilities,
      };
    });

    res.json({ data: clientData });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении способностей ${errorMessage}`));
  }
};

export const getCharacterClassByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsId = req.params.id;
    const paramsIdNumber = Number(req.params.id);

    if (!paramsId && isNaN(paramsIdNumber)) {
      next(ApiError.BadRequest('Класс не найден'));
    }

    const characterClass = await getCharacterClassById(paramsIdNumber);

    if (!characterClass) {
      next(ApiError.BadRequest('Класс не найден'));
    } else {
      res.json({
        data: characterClass,
      });
    }

    next();
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении класса ${errorMessage}`));
  }
};

export const updateCharacterClassHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const characterClass = await updateCharacterClass(Number(req.params.id), req.body);
    if (!characterClass) {
      next(ApiError.BadRequest('Класс не найден'));
    }
    res.json({
      data: {
        message: 'ok',
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при изменении способности ${errorMessage}`));
  }
};

export const deleteCharacterClassHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const characterClass = await deleteCharacterClass(Number(req.params.id));

    if (!characterClass) {
      next(ApiError.BadRequest('Класс не найден'));
    }

    res.json({ message: 'Способность удалена' });
  } catch (error) {
    const errorMessage = errorHandler(error);

    next(ApiError.Internal(`Ошибка при удалении класса ${errorMessage}`));
  }
};
