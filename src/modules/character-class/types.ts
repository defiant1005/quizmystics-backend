import { Model } from 'sequelize';

export interface ICharacterClassAttributes {
  id: number;
  title: string;
  description: string;
  luck: number;
  lives: 1 | 2 | 3;
}

export interface ICharacterClassCreationAttributes extends Omit<ICharacterClassAttributes, 'id'> {
  abilities: Array<Omit<ICharacterAbilitiesAttributes, 'id'>>;
}

export interface ICharacterClassClientData extends ICharacterClassAttributes {
  abilities: Array<ICharacterAbilitiesClientData>;
}

export class ICharacterClassModel
  extends Model<ICharacterClassAttributes, Omit<ICharacterClassCreationAttributes, 'abilities'>>
  implements ICharacterClassAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public luck!: number;
  public lives!: 1 | 2 | 3;
}

// CharacterAbilities
interface ICharacterAbilitiesAttributes {
  id: number;
  cooldown: number;
  abilityId: number;
  characterClassId: number;
}

export interface ICharacterAbilitiesCreationAttributes extends Omit<ICharacterAbilitiesAttributes, 'id'> {}

export interface ICharacterAbilitiesClientData extends Omit<ICharacterAbilitiesAttributes, 'characterClassId' | 'id'> {}

export class ICharacterAbilitiesModel
  extends Model<ICharacterAbilitiesAttributes, ICharacterAbilitiesCreationAttributes>
  implements ICharacterAbilitiesAttributes
{
  public id!: number;
  public cooldown!: number;
  public abilityId!: number;
  public characterClassId!: number;
}
