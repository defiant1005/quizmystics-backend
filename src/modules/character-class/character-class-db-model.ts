import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';
import { ICharacterAbilitiesModel, ICharacterClassModel } from './types.js';

export const CharacterClass = sequelize.define<ICharacterClassModel>('character_class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING, allowNull: false },
  luck: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 15,
    },
  },
  lives: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3,
    },
  },
});

export const CharacterClassAbility = sequelize.define<ICharacterAbilitiesModel>('character_class_ability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cooldown: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  characterClassId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  abilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
