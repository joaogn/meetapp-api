import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { isBefore, parseISO, subHours } from 'date-fns';
import Meetup from '../models/Meetups';

interface MeetupType {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  banner_id?: number;
  user_id?: number;
}


class MeetupController {
  async store(req: Request, res: Response) {
    const { date }:MeetupType = req.body;
    const validDate = await Meetup.findOne({
      where: {
        user_id: req.userId,
        date: {
          [Op.between]: [subHours(parseISO(date), 6), parseISO(date)],
        },
      },
    });
    if (validDate) {
      return res.status(400).json({ error: 'You already have a registered meetup in the next 6 hours' });
    }
    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Cannot register date has passed' });
    }
    const meetup = await Meetup.create(req.body);
    return res.json(meetup);
  }

  async index(req: Request, res: Response) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });
    return res.json(meetups);
  }

  async delete(req: Request, res: Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found' });
    }
    if (meetup) {
      // só pode cancelar meetup até 6h antes da data
      if (isBefore(subHours(meetup.date, 6), new Date())) {
        return res.status(400).json({ error: 'can only cancel meetup 6 hours in advance' });
      }
    }

    await Meetup.destroy({ where: { id: meetupId } });
    return res.send();
  }
}

export default new MeetupController();
