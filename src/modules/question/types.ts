import { Model } from 'sequelize';

export enum AnswerVariant {
  ANSWER1 = 'answer1',
  ANSWER2 = 'answer2',
  ANSWER3 = 'answer3',
  ANSWER4 = 'answer4',
}

interface IQuestionAttributes {
  id: number;
  categoryId: number;
  title: string;
  [AnswerVariant.ANSWER1]: string;
  [AnswerVariant.ANSWER2]: string;
  [AnswerVariant.ANSWER3]: string;
  [AnswerVariant.ANSWER4]: string;
  correct_answer: AnswerVariant;
}

export interface IQuestionCreationAttributes extends Omit<IQuestionAttributes, 'id' | 'categoryId'> {}

export interface IQuestionClientData extends IQuestionAttributes {}

export class IQuestionModel
  extends Model<IQuestionAttributes, IQuestionCreationAttributes>
  implements IQuestionAttributes
{
  public id!: number;
  public title!: string;
  public categoryId!: number;
  public [AnswerVariant.ANSWER1]!: string;
  public [AnswerVariant.ANSWER2]!: string;
  public [AnswerVariant.ANSWER3]!: string;
  public [AnswerVariant.ANSWER4]!: string;
  public correct_answer!: AnswerVariant;
}
