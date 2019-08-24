import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import SessionValidation from './app/middlewares/SessionValidation';
import UserController from './app/controllers/UserController';
import MeetupController from './app/controllers/MeetupController';
import { UserStoreValidation, UpdateStoreValidation } from './app/middlewares/UserValidation';
import { MeetupStoreValidation } from './app/middlewares/MeetupValidation';
import AuthSession from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidation, SessionController.store);
routes.post('/users', UserStoreValidation, UserController.store);
routes.use(AuthSession);
routes.put('/users', UpdateStoreValidation, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupStoreValidation, MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:meetupId', MeetupController.delete);
routes.put('/meetups/:meetupId/update', MeetupController.update);

export default routes;
