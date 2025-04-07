import { NextFunction, Request, Response } from 'express';
import { createAdmin } from './admin-service.js';
import { errorHandler } from '../../error/error-handler.js';
import { ApiError } from '../../error/ApiError.js';
import bcrypt from 'bcrypt';
import { generateTokens, saveToken } from '../jwt/jwt-service.js';
import { adminDto } from './admin-dto.js';
import { Admin } from './admin-db-model.js';

export const createAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 3);

    const candidate = await Admin.findOne({ where: { email: email } });

    if (candidate) {
      next(ApiError.badRequest('Админ с таким email уже существует'));
    }

    const admin = await createAdmin({ email, password: hashPassword, role });

    const adminClientData = adminDto(admin);

    const tokens = generateTokens(adminClientData);
    await saveToken(adminClientData.id, tokens.refreshToken);

    res.status(201).json({
      data: {
        ...tokens,
        user: adminClientData,
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.internal(`Ошибка при создании админа ${errorMessage}`));
  }
};
