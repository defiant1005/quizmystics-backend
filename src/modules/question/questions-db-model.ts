import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize.js';

class Question extends Model {}

const questionFields = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
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
};

const questionOptions = {
  sequelize,
  modelName: 'Question',
  tableName: 'questions',
  timestamps: true,
};

Question.init(questionFields, questionOptions);

export default Question;
