export enum AnswerVariant {
  ANSWER1 = 'answer1',
  ANSWER2 = 'answer2',
  ANSWER3 = 'answer3',
  ANSWER4 = 'answer4',
}

export interface IQuestion {
  id: number;
  categoryId: number;
  title: string;
  [AnswerVariant.ANSWER1]: string;
  [AnswerVariant.ANSWER2]: string;
  [AnswerVariant.ANSWER3]: string;
  [AnswerVariant.ANSWER4]: string;
  correct_answer: AnswerVariant;
}

export interface IQuestionCreate extends Omit<IQuestion, 'id' | 'categoryId'> {}
