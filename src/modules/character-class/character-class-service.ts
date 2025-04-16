import { CharacterClass, CharacterClassAbility } from './character-class-db-model.js';
import { ICharacterClassCreationAttributes } from './types.js';

export const createCharacterClass = async (data: ICharacterClassCreationAttributes) => {
  const { abilities, ...other } = data;

  const newClass = await CharacterClass.create(other);

  await Promise.all(
    abilities.map((item) =>
      CharacterClassAbility.create({
        characterClassId: newClass.id,
        abilityId: item.abilityId,
        cooldown: item.cooldown,
      }),
    ),
  );

  return newClass;
};

export const getAllCharacterClasses = async () => {
  return await CharacterClass.findAll();
};

export const getCharacterClassById = async (id: number) => {
  return await CharacterClass.findByPk(id);
};

export const updateCharacterClass = async (id: number, data: ICharacterClassCreationAttributes) => {
  const characterClass = await CharacterClass.findByPk(id);

  if (!characterClass) {
    throw new Error('Класс не найдена');
  }
  return await characterClass.update(data);
};

export const deleteCharacterClass = async (id: number) => {
  const characterClass = await CharacterClass.findByPk(id);

  if (!characterClass) {
    throw new Error('Класс не найден');
  }
  await characterClass.destroy();
  return characterClass;
};

export const getAllCharacterClassAbilities = async () => {
  return await CharacterClassAbility.findAll();
};
