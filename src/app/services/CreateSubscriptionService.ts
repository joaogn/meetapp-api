import {
  isBefore, format, startOfHour, endOfHour,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import SubscribeMail from '../jobs/SubscribeMail';

import Queue from '../../lib/Queue';

class CreateSubscriptionService {
  async run({ meetupId, userId }) {
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
      return { status: 400, response: { error: 'meetup not found' } };
    }

    if (meetup.user_id === userId) {
      return { status: 400, response: { error: 'Cannot sign up for own meetup' } };
    }

    if (isBefore(meetup.date, new Date())) {
      return { status: 400, response: { error: 'this metup has passed' } };
    }

    const isSubscribed = await Subscription.findOne({
      where: { meetup_id: meetupId, user_id: userId },
    });

    if (isSubscribed) {
      return { status: 400, response: { error: 'User is already subscribed to this meetup' } };
    }

    const checkDate = await Subscription.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Meetup,
          as: 'meetups',
          where: {
            date: {
              [Op.between]: [format(startOfHour(meetup.date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
                format(endOfHour(meetup.date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")],
            },
          },
        },
      ],
    });

    if (checkDate) {
      return { status: 400, response: { error: 'Cannot subscribe to two meetups at the same time' } };
    }


    const { id, meetup_id, user_id } = await Subscription.create({
      meetup_id: meetupId, user_id: userId,
    });

    const user = await User.findByPk(userId);

    // adiciona o novo email a fila, passando a key e as variaveis do job
    await Queue.add(SubscribeMail.key, {
      meetup,
      user,
    });

    return { status: 200, response: { id, meetup_id, user_id } };
  }
}

export default new CreateSubscriptionService();
