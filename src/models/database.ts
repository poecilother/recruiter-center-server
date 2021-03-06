import { Sequelize } from 'sequelize';
import { Service } from 'typedi';

import { UserModel } from './user-model';
import { UserTokenModel } from './user-token-model';

@Service()
class Database {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      dialect: 'mysql',
      logging: false,
      timezone: '+01:00'
    });

    this.initializeModels();
  }

  private initializeModels() {
    UserModel(this.sequelize);
    UserTokenModel(this.sequelize);
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

  public getDatabaseInstance() {
    return this.sequelize;
  }
}

export default Database;
