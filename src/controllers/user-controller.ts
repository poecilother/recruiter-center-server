import { Request, Response } from 'express';
import { Service } from "typedi";
import { UserService } from '../services';
import { ResponseMessage, ResponseStatus } from '../resources';

@Service()
export class UserController {
  constructor(private userService: UserService) {
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  public async registerUser(req: Request, res: Response): Promise<Response> {
    const { user } = req.body;
    
    try {
      const registeredUser = await this.userService.registerUser(user);
      return res.status(ResponseStatus.CREATED).send(registeredUser);
    } catch (err) {
      console.error(err);
      return res.status(ResponseStatus.INTERNAL_SERVER).send(ResponseMessage.general.error);
    }
  }

  public async loginUser(req: Request, res: Response): Promise<Response> {
    const { user } = req.body;

    try {
      const resultObject = await this.userService.loginUser(user);
      if (!resultObject) return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.general.wrongCredentials);
      return res.status(ResponseStatus.OK).send(resultObject);
    } catch (err) {
      console.error(err);
      return res.status(ResponseStatus.INTERNAL_SERVER).send(ResponseMessage.general.error);
    }
  }
}
