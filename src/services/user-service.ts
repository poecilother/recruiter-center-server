import { Service } from 'typedi';
import { User } from '../models'
import { UserInterface } from '../interfaces';

@Service()
export class UserService {
  public async getUserByEmail(email: string) {
    try {
      return await User.findOne({ where: { email } });
    } catch (err) {
      console.error('Sequelize ERROR in UserService getUserByEmail() User.findOne(): ', err);
      throw err;
    }
  }

  public async registerUser(user: UserInterface): Promise<ResponseUser> {
    try {
      const registeredUser = await User.create(user);
      return new ResponseUser(
        registeredUser.id,
        registeredUser.email,
        registeredUser.createdAt
      );
    } catch (err) {
      console.error('Sequelize ERROR in UserService registerUser() User.create(): ', err);
      throw err;
    }
  }

  public async loginUser(user: UserInterface) {
    let userId: string;

    try {
      const loggedUser = await User.findOne({ where: { email: user.email }});

      if (!loggedUser) return false;
      if (!await loggedUser.verifyPassword(user.password)) return false;

      userId = loggedUser.id;
    } catch (err) {
      console.error('Sequelize ERROR in UserService loginUser(): ', err);
      throw err;
    }

    
  }
}

class ResponseUser {
  private id: string;
  private email: string;
  private createdAt: Date;

  constructor(id: string, email: string, createdAt: Date) {
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
