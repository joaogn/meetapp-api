import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => cb(null, uuidv4() + extname(file.originalname)),
  }),
};
