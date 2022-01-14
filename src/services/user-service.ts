import { Service } from 'typedi';
import models from '../models';
import { User } from '../interfaces';

@Service()
export class UserService {
  public async getUserByEmail(email: string) {
    try {
      return await models.User.findOne({ where: { email } });
    } catch (err) {
      console.error('Sequelize ERROR in UserService getUserByEmail() models.User.findOne(): ', err);
      throw err;
    }
  }

  public async registerUser(user: User): Promise<ResponseUser> {
    try {
      const registeredUser = await models.User.create(user);
      return new ResponseUser(
        registeredUser.getDataValue('id'),
        registeredUser.getDataValue('email'),
        registeredUser.getDataValue('createdAt')
      );
    } catch (err) {
      console.error('Sequelize ERROR in UserService register() models.User.create(): ', err);
      throw err;
    }
  }
}

class ResponseUser {
  private id: string;
  private email: string;
  private createdAt: string;

  constructor(id: string, email: string, createdAt: string) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt;
  }

  public getResponseUser() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
    }
  }
}
