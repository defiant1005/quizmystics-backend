import { Admin } from './admin-db-model.js';
import { IAdminCreationAttributes } from './types.js';

export const createAdmin = async (data: IAdminCreationAttributes) => {
  return await Admin.create(data);
};

export const findAdminByEmail = async (email: string) => {
  return await Admin.findOne({ where: { email: email } });
};

export const findAdminById = async (id: number) => {
  return await Admin.findOne({ where: { id: id } });
};
