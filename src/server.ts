import 'dotenv/config';
import 'reflect-metadata';

import App from './app';

const port: number = parseInt(process.env.PORT) || 4000;
const app = new App(port);

app.listen();
