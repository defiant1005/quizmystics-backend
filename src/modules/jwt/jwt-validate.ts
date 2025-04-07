import jwt from 'jsonwebtoken';
import { IAdminClientData } from '../admin/types.js';

export function validateAccessToken(accessToken: string) {
  try {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as IAdminClientData;
  } catch {
    return null;
  }
}

export function validateRefreshToken(refreshToken: string) {
  try {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as IAdminClientData;
  } catch {
    return null;
  }
}
