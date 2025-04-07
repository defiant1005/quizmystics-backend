import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';
import { IAdminModel } from './types.js';

export const Admin = sequelize.define<IAdminModel>('admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.STRING, allowNull: false },
});
