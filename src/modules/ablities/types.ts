import { Model } from 'sequelize';

export enum AbilitySlug {
  LUCK = 'luck',
  FREEZE = 'freeze',
  HIDE_QUESTION = 'hide-question',
  HIDE_ONE = 'hide-one',
  SHUFFLE = 'shuffle',
  REMOVE_WRONG = 'remove-wrong',
  COPY_ANSWER = 'copy-answer',
  SILENCE = 'silence',
  BKB = 'bkb',
  REFLECT = 'reflect',
  SHORT_TIME = 'short-time',
  PEEK = 'peek',
  DOUBLE_SHOT = 'double-shot',
  TRAP_QUESTION = 'trap-question',
  REMOVE_LUCK = 'remove-luck',
}

interface IAbilityAttributes {
  id: number;
  title: string;
  slug: AbilitySlug;
  description: string;
}

export interface IAbilityCreationAttributes extends Omit<IAbilityAttributes, 'id'> {}

export interface IAbilityClientData extends IAbilityAttributes {}

export class IAbilityModel extends Model<IAbilityAttributes, IAbilityCreationAttributes> implements IAbilityAttributes {
  public id!: number;
  public title!: string;
  public slug!: AbilitySlug;
  public description!: string;
}
