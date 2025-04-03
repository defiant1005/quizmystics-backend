import { Question } from './question-db-model.js';
import { IQuestionCreate } from './types.js';

export const createQuestion = async (data: IQuestionCreate) => {
  return await Question.create(data);
};

export const getAllQuestions = async () => {
  return await Question.findAll();
};

export const getQuestionById = async (id: number) => {
  return await Question.findByPk(id);
};

export const updateQuestion = async (id: number, data: IQuestionCreate) => {
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
