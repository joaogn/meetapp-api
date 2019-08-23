import { Request, Response } from 'express';
import File from '../models/File';

class FileController {
  async store(req:Request, res:Response) {
    if (!req.file) {
      return res.status(400).json({ error: 'image file not found' });
    }
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
