import jwt from 'jsonwebtoken';
import { JWTTokens } from './jwt-db-model.js';
import { IAdminClientData } from '../admin/types.js';

export function generateTokens(payload: IAdminClientData) {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '30d' });

  return { accessToken, refreshToken };
}

export async function saveToken(adminId: number, refreshToken: string) {
  const tokenData = await JWTTokens.findOne({ where: { userId: adminId } });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return await tokenData.save();
  }

  return await JWTTokens.create({ userId: adminId, refreshToken });
}

export const findRefreshToken = async (refreshToken: string) => {
  return await JWTTokens.findOne({ where: { refreshToken: refreshToken } });
};

export const removeRefreshToken = async (refreshToken: string) => {
  return await JWTTokens.destroy({ where: { refreshToken } });
};
