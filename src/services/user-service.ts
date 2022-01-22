import { Service } from 'typedi';
import { User } from '../models';
import Database from '../models/database';
import { UserInterface } from '../interfaces';
import { TokenService } from './token-service';

@Service()
export class UserService {
  constructor(
    private tokenService: TokenService,
    private database: Database
  ) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  public async registerUser(user: UserInterface): Promise<ResponseUser> {
    const registeredUser = await User.create(user);
    return new ResponseUser(
      registeredUser.id,
      registeredUser.email,
      registeredUser.createdAt
    );
  }

  public async loginUser(user: UserInterface): Promise<LoginResult | boolean> {
    const foundUser = await User.findOne({ where: { email: user.email }});
    const result: LoginResult = {
      accessToken: '',
      refreshToken: ''
    };

    if (!foundUser) return false;
    if (!await foundUser.verifyPassword(user.password)) return false;

    const loginTransaction = await this.database.getDatabaseInstance().transaction();

    try {
      foundUser.lastLogin = new Date();
      await foundUser.save({ transaction: loginTransaction });

      result.refreshToken = await this.tokenService.getRefreshToken(foundUser.id, loginTransaction);
      result.accessToken = this.tokenService.getAccessToken(foundUser.id);

      await loginTransaction.commit();
    } catch (err) {
      await loginTransaction.rollback();
      throw err;
    }
    
    return result;
  }
}
interface LoginResult {
  accessToken: string,
  refreshToken: string
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
