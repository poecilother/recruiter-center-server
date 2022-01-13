import Database from './database';
import Container from 'typedi';

const database = Container.get(Database);

export const models = database.getDatabaseModels();
