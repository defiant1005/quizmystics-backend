import { Admin } from './admin-db-model.js';
import { IAdminCreationAttributes } from './types.js';

export const createAdmin = async (data: IAdminCreationAttributes) => {
  return await Admin.create(data);
};

export const updateAdmin = async (id: number, data: IAdminCreationAttributes) => {
  const admin = await Admin.findByPk(id);

  if (!admin) {
    throw new Error('Admin not found');
  }

  return await admin.update(data);
};

export const findAdminByEmail = async (email: string) => {
  return await Admin.findOne({ where: { email: email } });
};

export const findAdminById = async (id: number) => {
  return await Admin.findOne({ where: { id: id } });
};

export const findAllAdmins = async () => {
  return await Admin.findAll();
};

export const removeAdmin = async (id: number) => {
  return await Admin.destroy({ where: { id: id } });
};
