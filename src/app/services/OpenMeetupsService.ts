import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';

class OpenMeetupsService {
  async run({ user_id, date, page }) {
    const meetups = await Meetup.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'past', 'title', 'description', 'location', 'date', 'banner_id', 'user_id'],
      where: {
        user_id: { [Op.ne]: user_id },
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
        user_id,
      },
    });

    const openMeetups = meetups.filter((meetup) => {
      if (subscriptions.find((subscription) => subscription.meetup_id === meetup.id)) {
        return null;
      }
      return meetup;
    });

    return openMeetups;
  }
}

export default new OpenMeetupsService();
