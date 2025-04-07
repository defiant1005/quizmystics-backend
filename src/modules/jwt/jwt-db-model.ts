import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';
import { IJWTTokensModel } from './types.js';

export const JWTTokens = sequelize.define<IJWTTokensModel>('jwt-tokens', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  refreshToken: { type: DataTypes.STRING, allowNull: false },
});
