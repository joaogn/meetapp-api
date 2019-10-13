import { Model } from 'sequelize';
import sequelize from '../../database';
import Meetup from './Meetup';
import User from './User';

class Subscription extends Model {
  public id!: number;

  public user_id!: number;

  public meetup_id!: number;

  public meetups!: {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    created_at: string;
    updated_at: string;
    banner_id: number;
    user_id: number;
    past: boolean;
  }

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
