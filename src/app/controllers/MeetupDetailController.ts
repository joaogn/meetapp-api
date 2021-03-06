import { Request, Response } from 'express';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupDetailController {
  async index(req: Request, res: Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId, {
      attributes: ['title', 'description', 'location', 'date', 'banner_id', 'past'],
      include: [{
        model: File,
        as: 'file',
        attributes: ['path', 'url'],
      }],
    });
    return res.json(meetup);
  }
}

export default new MeetupDetailController();
