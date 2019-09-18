import { Request, Response } from 'express';
import Meetup from '../models/Meetups';
import File from '../models/File';

class MeetupDetailController {
  async index(req: Request, res: Response) {
    const { meetupId } = req.params;
    const meetup = await Meetup.findByPk(meetupId, {
      attributes: ['title', 'description', 'location', 'date'],
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
