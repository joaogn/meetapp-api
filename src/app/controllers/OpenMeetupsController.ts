import { Request, Response } from 'express';
import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetups';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';

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
      },
      {
        model: File,
        as: 'file',
        attributes: ['path', 'url'],
      },
      ],
    });

    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
    });

    const freeMeetups = meetups.filter((meetup) => {
      if (subscriptions.find((subscription) => subscription.meetup_id === meetup.id)) {
        return null;
      }
      return meetup;
    });


    res.json(freeMeetups);
  }
}

export default new OpenMeetupsController();
