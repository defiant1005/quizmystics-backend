import { Category } from './category-db-model.js';
import { ICategoryCreationAttributes } from './types.js';

export const createCategory = async (data: ICategoryCreationAttributes) => {
  return await Category.create(data);
};

export const getAllCategories = async () => {
  return await Category.findAll();
};

export const getCategoryById = async (id: number) => {
  return await Category.findByPk(id);
};

export const updateCategory = async (id: number, data: ICategoryCreationAttributes) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Категория не найдена');
  }
  return await category.update(data);
};

export const deleteCategory = async (id: number) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Категория не найдена');
  }
  await category.destroy();
  return category;
};
