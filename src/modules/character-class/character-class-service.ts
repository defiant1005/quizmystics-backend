import { CharacterClass, CharacterClassAbility } from './character-class-db-model.js';
import { ICharacterClassClientData, ICharacterClassCreationAttributes } from './types.js';
import { IAbilityClientData } from '../ablities/types.js';
import { Ability } from '../ablities/abilities-db-model.js';

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

export const getCharacterClassesWithAbilities = async (): Promise<ICharacterClassClientData[]> => {
  const classes = await CharacterClass.findAll({
    include: [
      {
        model: Ability,
        through: {
          attributes: ['cooldown'],
        },
        attributes: ['id', 'title', 'slug', 'description'],
      },
    ],
    order: [['id', 'ASC']],
  });

  return classes.map((charClass) => {
    const abilities = (charClass.get('abilities') ?? []) as (IAbilityClientData & {
      character_class_ability: { cooldown: number };
    })[];

    return {
      id: charClass.id,
      title: charClass.title,
      description: charClass.description,
      luck: charClass.luck,
      lives: charClass.lives,
      abilities: abilities.map((ability) => ({
        abilityId: ability.id,
        cooldown: ability.character_class_ability.cooldown,
        title: ability.title,
        slug: ability.slug,
        description: ability.description,
      })),
    };
  });
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
