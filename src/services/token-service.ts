import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import moment from 'moment';
import { TokenInterface } from '../interfaces';
import { UserToken } from '../models';

@Service()
export class TokenService {
  private accessTokenCredentials: TokenInterface;
  private refreshTokenCredentials: TokenInterface;

  constructor() {
    this.accessTokenCredentials = {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRATION
    }
    this.refreshTokenCredentials = {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRATION
    }
  }

  getAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.accessTokenCredentials.secret, { expiresIn: this.accessTokenCredentials.expiresIn });
  }
  
  async getRefreshToken(userId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId }, this.refreshTokenCredentials.secret, { expiresIn: this.refreshTokenCredentials.expiresIn });
    let tokenInDb: UserToken;
    
    try {
      tokenInDb = await UserToken.findOne({ where: { userId }});
    } catch (err) {
      console.error('jsonwebtoken ERROR in TokenService getRefreshToken() UserToken.findOne(): ', err);
      throw err;
    }

    if (!tokenInDb) {
      try {
        tokenInDb = await UserToken.create({
          userId,
          token: refreshToken,
          validUntil: moment(new Date()).add(Number(this.refreshTokenCredentials.expiresIn), 'ms').toDate()
        });
      } catch (err) {
        console.error('jsonwebtoken ERROR in TokenService getRefreshToken() UserToken.create(): ', err);
        throw err;
      }
    } else {
      tokenInDb.token = refreshToken;
      tokenInDb.validUntil = moment(new Date()).add(Number(this.refreshTokenCredentials.expiresIn), 'ms').toDate();
      try {
        await tokenInDb.save();
      } catch (err) {
        console.error('jsonwebtoken ERROR in TokenService getRefreshToken() tokenInDb.save(): ', err);
        throw err;
      }
    }

    return refreshToken;
  }

  verifyAccessToken(accessToken: string): object {
    try {
      const verifiedToken = jwt.verify(accessToken, this.accessTokenCredentials.secret);
      return verifiedToken;
    } catch (err) {
      console.error('jsonwebtoken ERROR in TokenService verifyAccessToken() jwt.verify(): ', err);
      throw err;
    }
  }

  async verifyRefreshToken(refreshToken: string, userId: string): Promise<boolean> {
    let userToken: UserToken;
    let isTokenValid: boolean;

    try {
      userToken = await UserToken.findOne({ where: { userId }});
    } catch (err) {
      
    }
    try {
      isTokenValid = await userToken.verifyToken(refreshToken);
    } catch (err) {

    }
    
    return isTokenValid;
  }
}
