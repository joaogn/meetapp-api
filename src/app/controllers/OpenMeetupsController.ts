import { Request, Response } from 'express';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetups';
import User from '../models/User';

class OpenMeetupsController {
  async index(req: Request, res: Response) {
    const { date, page } = req.query;
    const meetups = await Meetup.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      where: {
        user_id: { [Op.ne]: req.userId },
        date: {
          [Op.and]: {
            [Op.gt]: new Date(),
            [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
          },
        },
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      }],
    });
    res.json(meetups);
  }
}

export default new OpenMeetupsController();
