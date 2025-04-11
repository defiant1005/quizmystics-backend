import { NextFunction, Request, Response } from 'express';
import {
  createAdmin,
  findAdminByEmail,
  findAdminById,
  findAllAdmins,
  removeAdmin,
  updateAdmin,
} from './admin-service.js';
import { errorHandler } from '../../error/error-handler.js';
import { ApiError } from '../../error/ApiError.js';
import bcrypt from 'bcrypt';
import { findRefreshToken, generateTokens, removeRefreshToken, saveToken } from '../jwt/jwt-service.js';
import { adminDto } from './admin-dto.js';
import { validateRefreshToken } from '../jwt/jwt-validate.js';

export const createAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;

    const candidate = await findAdminByEmail(email);

    if (candidate) {
      next(ApiError.BadRequest('Админ с таким email уже существует'));
    }

    const hashPassword = await bcrypt.hash(password, 3);

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
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const loginAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return next(ApiError.BadRequest('Неверный email или пароль'));
    }

    const isPassEquals = await bcrypt.compare(password, admin.password);

    if (!isPassEquals) {
      next(ApiError.BadRequest('Неверный email или пароль'));
    }

    const adminClientData = adminDto(admin);

    const tokens = generateTokens(adminClientData);
    await saveToken(adminClientData.id, tokens.refreshToken);

    res.json({
      data: {
        ...tokens,
        user: adminClientData,
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const refresh = await findRefreshToken(refreshToken);

    if (!refresh) {
      return next(ApiError.Internal('Пользователь не найден'));
    }

    await removeRefreshToken(refreshToken);

    res.json({
      message: 'ok',
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const refresh = await findRefreshToken(refreshToken);

    if (!refresh) {
      return next(ApiError.Unauthorized('Пользователь не найден'));
    }

    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await findRefreshToken(refreshToken);

    if (!userData || !tokenFromDb) {
      return next(ApiError.Unauthorized('Пользователь не найден'));
    }

    const admin = await findAdminById(userData.id);

    const adminClientData = adminDto(admin!);

    const tokens = generateTokens(adminClientData);
    await saveToken(adminClientData.id, tokens.refreshToken);

    res.json({
      data: {
        ...tokens,
        user: adminClientData,
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const getAdminsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await findAllAdmins();

    res.json({
      data: admins.map((admin) => {
        return adminDto(admin);
      }),
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const getAdminByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const numId = Number(id);

    if (!id || isNaN(numId)) {
      return next(ApiError.BadRequest('Пользователь не найден'));
    }

    const candidate = await findAdminById(numId);

    if (!candidate) {
      return next(ApiError.BadRequest('Пользователь не найден'));
    }

    const adminClientData = adminDto(candidate);

    res.json({
      data: adminClientData,
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const removeAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const numId = Number(id);

    if (!id || isNaN(numId)) {
      return next(ApiError.BadRequest('Пользователь не найден'));
    }

    await removeAdmin(numId);

    res.json({
      message: 'ok',
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const editAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const numId = Number(id);

    if (!id || isNaN(numId)) {
      return next(ApiError.BadRequest('Пользователь не найден'));
    }
    const { email, password, role } = req.body;

    const candidate = await findAdminById(numId);

    if (!candidate) {
      next(ApiError.BadRequest('Пользователь не найден'));
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const admin = await updateAdmin(numId, { email, password: hashPassword, role });

    const adminClientData = adminDto(admin);

    res.status(201).json({
      data: {
        user: adminClientData,
      },
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка при создании админа ${errorMessage}`));
  }
};

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user === null) {
      next(ApiError.Internal('Админ не найден'));
      return;
    }

    const adminModel = await findAdminById(req.user.id);

    if (adminModel === null) {
      next(ApiError.Internal('Админ не найден'));
      return;
    }

    const admin = adminDto(adminModel);

    res.json({
      data: admin,
    });
  } catch (error) {
    const errorMessage = errorHandler(error);
    next(ApiError.Internal(`Ошибка получении данных ${errorMessage}`));
  }
};
