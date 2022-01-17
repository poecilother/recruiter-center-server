import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import * as argon2 from 'argon2';
import moment from 'moment';

interface UserTokenModelAttribute {
  id: string;
  userId: string;
  token: string;
  validUntil: Date;
}

interface UserModelInstance extends Optional<UserTokenModelAttribute, 'id'> {}

export class UserToken extends Model<UserTokenModelAttribute, UserModelInstance> {
  readonly id: string;
  readonly userId: string;
  token: string;
  validUntil: Date;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  async verifyToken(token: string): Promise<boolean> {
    if (moment(this.validUntil).isAfter(new Date())) return await argon2.verify(this.token, token);
    return false;
  }
}

export function UserTokenModel(sequelize: Sequelize) {
  UserToken.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
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
    userToken.token = hashedToken;
  });
}

