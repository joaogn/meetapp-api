import { Request, Response } from 'express';
import { isBefore, format } from 'date-fns';
import Meetup from '../models/Meetups';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req:Request, res:Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

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
          as: 'meetup',
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

    return res.json(subscription);
  }
}

export default new SubscriptionController();
