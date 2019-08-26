import Sequelize, { Model } from 'sequelize';
import sequelize from '../../database';

class File extends Model {
  public id!: number;

  public name!: string;

  public path!: string;

  public readonly created_at!: Date;

  public readonly updated_at!: Date;
}
File.init({
  name: Sequelize.STRING,
  path: Sequelize.STRING,
  url: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${process.env.APP_URL}/files/${this.path}`;
    },
  },
}, {
  tableName: 'files',
  sequelize, // this bit is important
});


export default File;
