import { Request, Response } from 'express';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';
import CreateSubscriptionService from '../services/CreateSubscriptionService';

class SubscriptionController {
  async store(req:Request, res:Response) {
    const { meetupId } = req.params;

    const result = await CreateSubscriptionService.run({ meetupId, userId: req.userId });

    return res.status(result.status).json(result.response);
  }

  async index(req:Request, res:Response) {
    const subscription = await Subscription.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'meetup_id', 'user_id'],
      include: [
        {
          model: Meetup,
          as: 'meetups',
          attributes: ['id', 'title', 'description', 'location', 'date', 'banner_id', 'past'],
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
        },
      ],
      order: [[{ model: Meetup, as: 'meetups' }, 'date', 'DESC']],
    });
    res.json(subscription);
  }

  async delete(req:Request, res:Response) {
    const subscription = await Subscription.findOne({
      include: [
        {
          model: Meetup,
          as: 'meetups',
          where: {
            id: req.params.meetupId,
          },
        },
      ],
    });


    if (!subscription) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (subscription.meetups.past) {
      return res.status(400).json({ error: 'You cannot cancel a past meetup' });
    }

    await Subscription.destroy({ where: { meetup_id: req.params.meetupId } });

    return res.json();
  }
}

export default new SubscriptionController();
