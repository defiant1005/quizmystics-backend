import { ICategoryClientData, ICategoryModel } from './types.js';

export function categoryDto(category: ICategoryModel): ICategoryClientData {
  return {
    id: category.id,
    title: category.title,
  };
}
