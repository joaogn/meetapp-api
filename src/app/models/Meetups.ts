import Sequelize, { Model } from 'sequelize';
import sequelize from '../../database';
import File from './File';
import User from './User';

class Meetups extends Model {
  public id!: number;

  public title!: string;

  public description!: string;

  public location!: string;

  public date!: Date;

  public banner_id!: number;

  public user_id!: number;

  public readonly created_at!: Date;

  public readonly updated_at!: Date;
}

Meetups.init({
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  location: Sequelize.STRING,
  date: Sequelize.DATE,
}, {
  tableName: 'meetups',
  sequelize, // this bit is important
});

Meetups.belongsTo(File, { foreignKey: 'banner_id', as: 'banner' });

Meetups.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Meetups;
