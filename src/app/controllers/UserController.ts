import { Request, Response } from 'express';
import User from '../models/User';

export interface UserType {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

class UserController {
  async store(req:Request, res:Response) {
    const data: UserType = req.body;
    const userExist = await User.findOne({ where: { email: data.email } });
    if (userExist) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email } = await User.create(data);
    return res.status(200).json({ id, name, email });
  }

  async update(req:Request, res:Response) {
    const {
      email,
      oldPassword,
    }:UserType = req.body;
    const user = await User.findByPk(req.userId);
    if (user.email !== email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match' });
    }
    console.log(req.body);
    const { id, name } = await user.update(req.body);

    return res.status(200).json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
