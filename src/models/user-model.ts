import { DataTypes, Model, Sequelize } from 'sequelize';
import * as argon2 from 'argon2';

class User extends Model {}

function UserModel(sequelize: Sequelize) {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { //? 0 - inactive, 1 - active, 2 - banned
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: new Date(null)
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

export default UserModel;
