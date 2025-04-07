import { Model, Optional } from 'sequelize';

interface IJWTTokensAttributes {
  userId: number;
  refreshToken: string;
}

interface IJWTTokensCreationAttributes extends Optional<IJWTTokensAttributes, 'userId'> {}

export class IJWTTokensModel
  extends Model<IJWTTokensAttributes, IJWTTokensCreationAttributes>
  implements IJWTTokensAttributes
{
  public userId!: number;
  public refreshToken!: string;
}
