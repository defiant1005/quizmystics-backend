import { Question } from './question-db-model.js';
import { IQuestionCreationAttributes } from './types.js';
import { Op } from 'sequelize';

export const createQuestion = async (data: IQuestionCreationAttributes) => {
  return await Question.create(data);
};

export const getAllQuestions = async () => {
  return await Question.findAll();
};

export const getQuestionById = async (id: number) => {
  return await Question.findByPk(id);
};

export const updateQuestion = async (id: number, data: IQuestionCreationAttributes) => {
  const question = await Question.findByPk(id);
  if (!question) {
    throw new Error('Вопрос не найден');
  }
  return await question.update(data);
};

export const deleteQuestion = async (id: number) => {
  const question = await Question.findByPk(id);
  if (!question) {
    throw new Error('Вопрос не найден');
  }
  await question.destroy();
  return question;
};

export const getRandomQuestionByCategory = async (categoryId: number, excludeIds: number[] = []) => {
  const where: any = { categoryId };
  if (excludeIds.length > 0) {
    where.id = { [Op.notIn]: excludeIds };
  }

  const questions = await Question.findAll({ where });
  if (questions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};
