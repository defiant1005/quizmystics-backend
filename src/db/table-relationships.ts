import { Question } from '../modules/question/question-db-model.js';
import { Category } from '../modules/category/category-db-model.js';
import { Ability, Character, CharacterClass, CharacterClassAbility } from '../modules/character/character-db-model.js';

export const tableRelationship = () => {
  Category.hasOne(Question);
  Question.belongsTo(Category);

  CharacterClass.hasMany(Character);
  Character.belongsTo(CharacterClass);

  CharacterClass.belongsToMany(Ability, { through: CharacterClassAbility });
  Ability.belongsToMany(CharacterClass, { through: CharacterClassAbility });
};
