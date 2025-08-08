import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';

export const Character = sequelize.define('character', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
});
