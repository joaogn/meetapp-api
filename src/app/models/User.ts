import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../../database';

class User extends Model {
  public id!: number;

  public name!: string;

  public email!: string;

  public password!: string;

  public password_hash!: string;

  public readonly created_at!: Date;

  public readonly updated_at!: Date;

  public checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init({
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.VIRTUAL,
  password_hash: Sequelize.STRING,
}, {
  tableName: 'users',
  sequelize, // this bit is important
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
User.addHook('beforeCreate', async (user:any) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 8);
  }
});

export default User;
