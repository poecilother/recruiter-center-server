import App from './app';
import routes from './routes';

const port: number = parseInt(process.env.PORT) || 4455;
const app = new App(port, routes);

app.listen();
