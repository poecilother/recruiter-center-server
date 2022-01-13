import { Sequelize } from 'sequelize';
import { Service } from 'typedi';

import UserModel from './user-model';

@Service()
class Database {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      dialect: 'mysql',
      logging: false
    });
    this.initializeModels();
  }

  private initializeModels() {
    UserModel(this.sequelize);
  }

  public async connect() {
    try {
      await this.sequelize.authenticate();
      console.log(`Connection to ${process.env.DB_DATABASE} has been established successfully.`);

      await this.sequelize.sync();
    } catch (err) {
      console.error('Sequelize connection ERROR: ', err);
    }
  }

  public getDatabaseModels() {
    return this.sequelize.models;
  }
}

export default Database;