import express from 'express';
import Container from 'typedi';
import Database from './models/database';
import AppRouter from './routes';

class App {
  private app: express.Application;
  private port: number;
  private database: Database;
  private appRouter: AppRouter;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.database = Container.get(Database);
    this.appRouter = Container.get(AppRouter)

    this.connectToDatabase(this.database);
    this.runMiddleware();
    this.runRoutes(this.appRouter);
  }

  private connectToDatabase(database: Database) {
    database.connect();
  }

  private runMiddleware() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private runRoutes(router: AppRouter) {
    this.app.use('/', router.getRouter());
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Recruiter Center Server listening on port ${this.port}`);
    });
  }
}

export default App;
