import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import * as argon2 from 'argon2';

interface UserModelAttribute {
  id: string;
  email: string;
  password: string;
  status?: number;
  lastLogin?: Date;
}

interface UserModelInstance extends Optional<UserModelAttribute, 'id'> {}

export class User extends Model<UserModelAttribute, UserModelInstance> {
  readonly id: string;
  readonly email: string;
  password: string;
  status?: number;
  lastLogin?: Date;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  public async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}

export function UserModel(sequelize: Sequelize) {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { //? 0 - inactive, 1 - active, 2 - banned
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: new Date(0)
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    
  });
  
  User.beforeCreate(async function (user: User) {
    const hashedPassword = await argon2.hash(user.getDataValue('password'));
    user.setDataValue('password', hashedPassword);
  });
}

