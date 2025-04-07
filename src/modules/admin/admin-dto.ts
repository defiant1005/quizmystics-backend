import { IAdminClientData, IAdminModel } from './types.js';

export function adminDto(admin: IAdminModel): IAdminClientData {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
}
