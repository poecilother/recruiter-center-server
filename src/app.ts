import express from 'express';

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number, routes: express.Router) {
    this.app = express();
    this.port = port;

    this.runMiddleware();
    this.runRoutes(routes);
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
