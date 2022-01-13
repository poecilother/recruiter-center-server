import { Sequelize } from 'sequelize';

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
  }

  public async connect() {
    try {
      console.log(this.sequelize.getDatabaseName());
      await this.sequelize.authenticate();
      console.log(`Connection to ${process.env.DB_DATABASE} has been established successfully.`);

      await this.sequelize.sync();
    } catch (err) {
      console.error('Sequelize connection ERROR: ', err);
    }
  }
}

export default Database;
