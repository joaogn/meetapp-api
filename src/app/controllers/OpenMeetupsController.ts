import { Request, Response } from 'express';
import OpenMeetupsService from '../services/OpenMeetupsService';

class OpenMeetupsController {
  async index(req: Request, res: Response) {
    const { date, page } = req.query;

    const result = await OpenMeetupsService.run({ user_id: req.userId, date, page });

    res.status(result.status).json(result.response);
  }
}

export default new OpenMeetupsController();
