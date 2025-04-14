import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../../error/error-handler.js';
import { ApiError } from '../../error/ApiError.js';
import { createAbility, deleteAbility, getAbilityById, getAllAbilities, updateAbility } from './ability-service.js';
import { abilityDto } from './ability-dto.js';

export const createAbilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ability = await createAbility(req.body);
    res.status(201).json(ability);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании способности ${errorMessage}`));
  }
};

export const getAllAbilitiesHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const abilities = await getAllAbilities();
    const dtoAbilities = abilities.map((ability) => abilityDto(ability));

    res.json({
      data: dtoAbilities,
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении способностей ${errorMessage}`));
  }
};

export const getAbilityByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsId = req.params.id;
    const paramsIdNumber = Number(req.params.id);

    if (!paramsId && isNaN(paramsIdNumber)) {
      next(ApiError.BadRequest('Способность не найдена'));
    }

    const ability = await getAbilityById(paramsIdNumber);

    if (!ability) {
      next(ApiError.BadRequest('Способность не найдена'));
    } else {
      res.json({
        data: abilityDto(ability),
      });
    }

    next();
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при получении способности ${errorMessage}`));
  }
};

export const updateAbilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ability = await updateAbility(Number(req.params.id), req.body);
    if (!ability) {
      next(ApiError.BadRequest('Способность не найдена'));
    }
    res.json(ability);
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при изменении способности ${errorMessage}`));
  }
};

export const deleteAbilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ability = await deleteAbility(Number(req.params.id));
    if (!ability) {
      next(ApiError.BadRequest('Способность не найдена'));
    }

    res.json({ message: 'Способность удалена' });
  } catch (error) {
    const errorMessage = errorHandler(error);

    next(ApiError.Internal(`Ошибка при удалении способности ${errorMessage}`));
  }
};
