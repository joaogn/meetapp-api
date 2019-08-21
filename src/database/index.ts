import * as Sequelize from 'sequelize';
import databaseConfig from '../config/database';

class Database {
  public sequelize: Sequelize.Sequelize;

  constructor() {
    this.init();
  }

  init() {
    this.sequelize = new Sequelize.Sequelize(databaseConfig);
  }
}

export default new Database().sequelize;
