import Database from './database';
import Container from 'typedi';

const database = Container.get(Database);
const models = database.getDatabaseModels();

export default models;
