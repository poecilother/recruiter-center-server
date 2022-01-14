import { Service, Container } from "typedi";
import { Router } from 'express';
import { UserController } from '../controllers';
import { UserMiddleware } from '../middleware';

@Service()
class UserRouter {
  private router: Router;

  constructor(
    private userController: UserController,
    private userMiddleware: UserMiddleware
  ) {
    this.router = Router();

    this.setRoutes();
  }

  private setRoutes() {
    this.router.post('/register', this.userMiddleware.registerUserValidation, this.userController.registerUser);
  }

  public getRouter() {
    return this.router;
  }
}

export default UserRouter;
