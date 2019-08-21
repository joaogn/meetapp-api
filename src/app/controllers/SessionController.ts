import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import authConfig from '../../config/auth';

interface Session {
  email: string;
  password: string;
}

class SessionControler {
  async store(req:Request, res:Response) {
    const data:Session = req.body;
    const { email, password } = data;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name } = user;

    return res.status(200).json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expireIn }),
    });
  }
}

export default new SessionControler();
