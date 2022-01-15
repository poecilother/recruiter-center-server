import { Request, Response, NextFunction } from "express";
import { UserService } from '../services';
import { Service } from "typedi";
import { ResponseMessage, ResponseStatus } from '../resources';
import { UserValidation, GeneralValidation } from '../utils/validation';

@Service()
export class UserMiddleware {
  constructor(
    private userService: UserService
  ) {
    this.registerUserValidation = this.registerUserValidation.bind(this);
  }

  public async registerUserValidation(req: Request, res: Response, next: NextFunction) {
    const userFields = ['email', 'password'];
    const invalidFields = [];
    let validateHelper;

    if (GeneralValidation.isRequestBodyMissing(req))
      return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.validation.missingParam('body'));
    if (!GeneralValidation.checkObjectKeys(req.body.user, userFields))
      return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.validation.invalidValue('user object', 'fields'));
    
    validateHelper = UserValidation.email(req.body.user.email);
    if (validateHelper) invalidFields.push({ field: 'email', message: validateHelper });

    validateHelper = UserValidation.password(req.body.user.password);
    if (validateHelper) invalidFields.push({ field: 'password', message: validateHelper });

    if (invalidFields.length) return res.status(ResponseStatus.BAD_REQUEST).send(invalidFields);

    try {
      if (await this.userService.getUserByEmail(req.body.user.email)) {
        return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.validation.valueAlreadyInUse('email'));
      }
    } catch (err) {
      console.error('ERROR in UserMiddleware registerUserValidation(): ', err);
      return res.status(ResponseStatus.INTERNAL_SERVER).send(ResponseMessage.general.error);
    }

    next();
  }

  public loginUserValidation(req: Request, res: Response, next: NextFunction) {
    const userFields = ['email', 'password'];

    if (GeneralValidation.isRequestBodyMissing(req))
      return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.validation.missingParam('body'));
    if (!GeneralValidation.checkObjectKeys(req.body.user, userFields))
      return res.status(ResponseStatus.BAD_REQUEST).send(ResponseMessage.validation.invalidValue('user object', 'fields'));

    next();
  }
}
