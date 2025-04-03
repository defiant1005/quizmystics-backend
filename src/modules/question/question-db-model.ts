import { sequelize } from '../../db/sequelize.js';
import { DataTypes } from 'sequelize';

export const Question = sequelize.define('question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  answer1: { type: DataTypes.STRING, allowNull: false },
  answer2: { type: DataTypes.STRING, allowNull: false },
  answer3: { type: DataTypes.STRING, allowNull: false },
  answer4: { type: DataTypes.STRING, allowNull: false },
  correct_answer: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['answer1', 'answer2', 'answer3', 'answer4']],
        msg: 'correct_answer должен быть одним из 4-х ответов',
      },
    },
  },
});
