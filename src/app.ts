import express from 'express';
import Container from 'typedi';
import Database from './models/database';

class App {
  private app: express.Application;
  private port: number;

  constructor(port: number, routes: express.Router) {
    this.app = express();
    this.port = port;

    this.connectToDatabase();
    this.runMiddleware();
    this.runRoutes(routes);
  }

  private connectToDatabase() {
    const database = Container.get(Database);

    database.connect();
  }

  private runMiddleware() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private runRoutes(routes: express.Router) {
    this.app.use('/', routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Recruiter Center Server listening on port ${this.port}`);
    });
  }
}

export default App;
