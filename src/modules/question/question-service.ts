import { Question } from './question-db-model.js';

export const createQuestion = async (data: any) => {
  return await Question.create(data);
};

export const getAllQuestions = async () => {
  return await Question.findAll();
};

export const getQuestionById = async (id: number) => {
  return await Question.findByPk(id);
};

export const updateQuestion = async (id: number, data: any) => {
  const question = await Question.findByPk(id);
  if (!question) return null;
  return await question.update(data);
};

export const deleteQuestion = async (id: number) => {
  const question = await Question.findByPk(id);
  if (!question) return null;
  await question.destroy();
  return question;
};
