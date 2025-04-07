import { Model } from 'sequelize';

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

interface IAdminAttributes {
  id: number;
  email: string;
  password: string;
  role: AdminRole;
}

export interface IAdminCreationAttributes extends Omit<IAdminAttributes, 'id'> {}

export class IAdminModel extends Model<IAdminAttributes, IAdminCreationAttributes> implements IAdminAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: AdminRole;
}

export interface IAdminClientData extends Omit<IAdminAttributes, 'password'> {}
