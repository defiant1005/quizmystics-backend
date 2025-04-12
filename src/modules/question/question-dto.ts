import { IQuestionClientData, IQuestionModel } from './types.js';

export function questionDto(question: IQuestionModel): IQuestionClientData {
  return {
    id: question.id,
    title: question.title,
    answer1: question.answer1,
    answer2: question.answer2,
    answer3: question.answer3,
    answer4: question.answer4,
    correct_answer: question.correct_answer,
    categoryId: question.categoryId,
  };
}
