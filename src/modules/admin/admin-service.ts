import { Admin } from './admin-db-model.js';
import { IAdminCreationAttributes } from './types.js';

export const createAdmin = async (data: IAdminCreationAttributes) => {
  return await Admin.create(data);
};

export const findAdmin = async (email: string) => {
  return await Admin.findOne({ where: { email: email } });
};
