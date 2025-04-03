import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';

export const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
});
