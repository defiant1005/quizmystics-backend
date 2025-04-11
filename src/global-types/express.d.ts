import { IAdminClientData } from '../modules/admin/types.js';

declare global {
  namespace Express {
    interface Request {
      user: IAdminClientData | null;
    }
  }
}
