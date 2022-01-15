import { Service } from 'typedi';
import { TokenInterface } from '../interfaces';
import jwt from 'jsonwebtoken';

@Service()
export class TokenService {
  private accessTokenCredentials: TokenInterface;

  constructor() {
    this.accessTokenCredentials = {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRATION
    }
  }

  public getAccessToken(userId: string) {
    return jwt.sign({ userId }, this.accessTokenCredentials.secret, { expiresIn: this.accessTokenCredentials.expiresIn });
  }

  public verifyAccessToken(accessToken: string) {
    try {
      const decodedToken = jwt.verify(accessToken, this.accessTokenCredentials.secret);
      return decodedToken;
    } catch (err) {
      console.error('jsonwebtoken ERROR in TokenService verifyAccessToken() jwt.verify(): ', err);
      throw err;
    }
  }
}
