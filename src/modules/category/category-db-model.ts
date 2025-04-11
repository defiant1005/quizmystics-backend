import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';
import { ICategoryModel } from './types.js';

export const Category = sequelize.define<ICategoryModel>('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
});
