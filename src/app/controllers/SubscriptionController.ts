import { Request, Response } from 'express';
import { isBefore, format } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetups';
import User from '../models/User';
import Subscription from '../models/Subscription';

import SubscribeMail from '../jobs/SubscribeMail';

import Queue from '../../lib/Queue';

class SubscriptionController {
  async store(req:Request, res:Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found' });
    }

    if (meetup.user_id === req.userId) {
      return res.status(400).json({ error: 'Cannot sign up for own meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'this metup has passed' });
    }

    const isSubscribed = await Subscription.findOne({
      where: { meetup_id: meetupId, user_id: req.userId },
    });

    if (isSubscribed) {
      return res.status(400).json({ error: 'User is already subscribed to this meetup' });
    }

    const checkDate = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          as: 'meetups',
          where: {
            date: format(meetup.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          },
        },
      ],
    });

    if (checkDate) {
      return res.status(400).json({ error: 'Cannot subscribe to two meetups at the same time' });
    }


    const subscription = await Subscription.create({ meetup_id: meetupId, user_id: req.userId });

    const user = await User.findByPk(req.userId);

    // adiciona o novo email a fila, passando a key e as variaveis do job
    await Queue.add(SubscribeMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }

  async index(req:Request, res:Response) {
    const subscription = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          as: 'meetups',
          where: {
            date: { [Op.gt]: new Date() },
          },
        },
      ],
    });
    res.json(subscription);
  }
}

export default new SubscriptionController();