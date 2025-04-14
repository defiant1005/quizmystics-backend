import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';
import { IAbilityModel } from './types.js';

export const Ability = sequelize.define<IAbilityModel>('ability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING, allowNull: false },
});
