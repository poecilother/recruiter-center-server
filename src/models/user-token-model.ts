import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import * as argon2 from 'argon2';

interface UserTokenModelAttribute {
  id: string;
  token: string;
  validUntil: Date;
}

interface UserModelInstance extends Optional<UserTokenModelAttribute, 'id'> {}

export class UserToken extends Model<UserTokenModelAttribute, UserModelInstance> {
  readonly id: string;
  readonly token: string;
  readonly validUntil: Date;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  async verifyToken(token: string): Promise<boolean> {
    return await argon2.verify(this.token, token);
  }
}

export function UserTokenModel(sequelize: Sequelize) {
  UserToken.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserToken',
    tableName: 'userToken',
    
  });
  
  UserToken.beforeCreate(async function (userToken: UserToken) {
    const hashedToken = await argon2.hash(userToken.token);
    userToken.setDataValue('token', hashedToken);
  });
}

