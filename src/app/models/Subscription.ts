import { Model } from 'sequelize';
import sequelize from '../../database';
import Meetup from './Meetups';
import User from './User';

class Subscription extends Model {
  public id!: number;

  public user_id!: number;

  public meetup_id!: number;

  public readonly created_at!: Date;

  public readonly updated_at!: Date;
}

Subscription.init({
}, {
  tableName: 'users_meetups',
  sequelize, // this bit is important
});

Meetup.hasMany(Subscription, { foreignKey: 'meetup_id', as: 'meetups' });
Subscription.belongsTo(Meetup, { foreignKey: 'meetup_id', as: 'meetups' });

User.hasMany(Subscription, { foreignKey: 'user_id', as: 'users' });
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'users' });


export default Subscription;
