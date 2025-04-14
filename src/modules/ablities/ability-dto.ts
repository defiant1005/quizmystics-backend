import { IAbilityClientData, IAbilityModel } from './types.js';

export function abilityDto(ability: IAbilityModel): IAbilityClientData {
  return {
    id: ability.id,
    title: ability.title,
    slug: ability.slug,
    description: ability.description,
  };
}
