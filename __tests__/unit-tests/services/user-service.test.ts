import 'jest';
import { UserService } from '../../../src/services/user-service';
import { TokenService } from '../../../src/services/token-service';
// jest.mock('../../../src/services/token-service');

describe('UserService test', () => {
  // const tokenService: jest.Mocked<TokenService> = {
  //   getAccessToken: jest.fn(),
  //   verifyAccessToken: jest.fn(),

  // }
  
  beforeAll(() => {
  });

  test('loginUser test', () => {
    const tokenService = new TokenService();
    const spy = jest.spyOn(tokenService, 'getAccessToken').mockImplementation((userId: string) => 'token');

    expect(tokenService.getAccessToken('1')).toBe('token');
  })
  
  
});
