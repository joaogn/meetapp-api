/* import multer from 'multer';
import uuidv4 from 'uuid/v4';
import { extname, resolve } from 'path';

console.log('chamou');
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => cb(null, uuidv4() + extname(file.originalname)),
  }),
}; */


import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, res.toString('hex') + extname(file.originalname));

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
