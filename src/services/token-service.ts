import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import moment from 'moment';
import { TokenInterface } from '../interfaces';
import { UserToken } from '../models';
import { Transaction } from 'sequelize/dist';

@Service()
export class TokenService {
  private accessTokenCredentials: TokenInterface;
  private refreshTokenCredentials: TokenInterface;

  constructor() {
    this.accessTokenCredentials = {
      secret: process.env.ACCESS_SECRET as string,
      expiresIn: process.env.ACCESS_EXPIRATION as string
    }
    this.refreshTokenCredentials = {
      secret: process.env.REFRESH_SECRET as string,
      expiresIn: process.env.REFRESH_EXPIRATION as string
    }
  }

  public getAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.accessTokenCredentials.secret, { expiresIn: this.accessTokenCredentials.expiresIn });
  }
  
  public async getRefreshToken(userId: string, transaction: Transaction): Promise<string> {
    const refreshToken = jwt.sign({ userId }, this.refreshTokenCredentials.secret, { expiresIn: this.refreshTokenCredentials.expiresIn });
    let tokenInDb = await UserToken.findOne({ where: { userId }});

    if (!tokenInDb) {
      tokenInDb = await UserToken.create({
        userId,
        token: refreshToken,
        validUntil: moment(new Date()).add(Number(this.refreshTokenCredentials.expiresIn), 'ms').toDate()
      });
    } else {
      tokenInDb.token = refreshToken;
      tokenInDb.validUntil = moment(new Date()).add(Number(this.refreshTokenCredentials.expiresIn), 'ms').toDate();
      await tokenInDb.save({ transaction: transaction });
    }

    return refreshToken;
  }

  public verifyAccessToken(accessToken: string): object {
    return jwt.verify(accessToken, this.accessTokenCredentials.secret);
  }

  public async verifyRefreshToken(refreshToken: string, userId: string): Promise<boolean> {
    const userToken = await UserToken.findOne({ where: { userId }});
    let isTokenValid: boolean;

    if (!userToken) {
      return false;
    }

    isTokenValid = await userToken.verifyToken(refreshToken);
    
    return isTokenValid;
  }
}
