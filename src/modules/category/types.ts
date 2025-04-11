import { Model } from 'sequelize';

interface ICategoryAttributes {
  id: number;
  title: string;
}

export interface ICategoryCreationAttributes extends Omit<ICategoryAttributes, 'id'> {}

export interface ICategoryClientData extends ICategoryAttributes {}

export class ICategoryModel
  extends Model<ICategoryAttributes, ICategoryCreationAttributes>
  implements ICategoryAttributes
{
  public id!: number;
  public title!: string;
}
