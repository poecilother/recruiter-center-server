import { Service } from 'typedi';
import { Router } from 'express';
import UserRouter from './user';

@Service()
class AppRouter {
  private router: Router;

  constructor(
    private userRouter: UserRouter
  ) {
    this.router = Router();

    this.setRoutes();
  }

  private setRoutes() {
    this.router.use('/user', this.userRouter.getRouter());
  }

  public getRouter() {
    return this.router;
  }
}

export default AppRouter;