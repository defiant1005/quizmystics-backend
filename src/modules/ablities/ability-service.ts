import { Ability } from './abilities-db-model.js';
import { IAbilityCreationAttributes } from './types.js';

export const createAbility = async (data: IAbilityCreationAttributes) => {
  return await Ability.create(data);
};

export const getAllAbilities = async () => {
  return await Ability.findAll();
};

export const getAbilityById = async (id: number) => {
  return await Ability.findByPk(id);
};

export const updateAbility = async (id: number, data: IAbilityCreationAttributes) => {
  const ability = await Ability.findByPk(id);
  if (!ability) {
    throw new Error('Способность не найдена');
  }
  return await ability.update(data);
};

export const deleteAbility = async (id: number) => {
  const ability = await Ability.findByPk(id);
  if (!ability) {
    throw new Error('Категория не найдена');
  }
  await ability.destroy();
  return ability;
};
