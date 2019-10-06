import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { isBefore, parseISO, subHours } from 'date-fns';
import Meetup from '../models/Meetups';

export interface MeetupType {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  banner_id?: number;
  user_id?: number;
  user?: {
    name?: string;
    email?: string;
  }
}


class MeetupController {
  async store(req: Request, res: Response) {
    const { date }:MeetupType = req.body;
    const validDate = await Meetup.findOne({
      where: {
        user_id: req.userId,
        date: {
          [Op.between]: [subHours(parseISO(date), 1), parseISO(date)],
        },
      },
    });
    if (validDate) {
      return res.status(400).json({ error: 'You already have a registered meetup in the next hour' });
    }
    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: "Can't register date has passed" });
    }
    const meetup = await Meetup.create({ ...req.body, user_id: req.userId });
    return res.json(meetup);
  }

  async index(req: Request, res: Response) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'title', 'date'],
      order: [['date', 'DESC']],
    });
    return res.json(meetups);
  }

  async delete(req: Request, res: Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found' });
    }
    if (meetup.past) {
      return res.status(400).json({ error: "can't delete past meetups" });
    }

    await Meetup.destroy({ where: { id: meetupId } });
    return res.send();
  }

  async update(req: Request, res: Response) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "can't update past meetups" });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Cannot update date has passed' });
    }

    const updatedMeetup = await Meetup.update(req.body, {
      where: { id: meetupId, user_id: req.userId },
    });

    if (!updatedMeetup) {
      return res.status(400).json({ error: 'this meetup does not currently belong to this user' });
    }

    return res.json(meetup);
  }
}

export default new MeetupController();
