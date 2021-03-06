import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';
import sequelize from '../../database';
import File from './File';
import User from './User';

class Meetup extends Model {
  public id!: number;

  public title!: string;

  public description!: string;

  public location!: string;

  public date!: Date;

  public banner_id!: number;

  public user_id!: number;

  public user!: {
    name?: string;
    email?: string;
  }

  public past!: boolean;

  public readonly created_at!: Date;

  public readonly updated_at!: Date;
}

Meetup.init({
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  location: Sequelize.STRING,
  date: Sequelize.DATE,
  past: {
    type: Sequelize.VIRTUAL,
    get() {
      return isBefore(this.date, new Date());
    },
  },
}, {
  tableName: 'meetups',
  sequelize, // this bit is important
});


Meetup.belongsTo(File, { foreignKey: 'banner_id', as: 'file' });

User.hasMany(Meetup, { foreignKey: 'user_id', as: 'user' });
Meetup.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Meetup;
