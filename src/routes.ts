import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import SessionValidation from './app/middlewares/SessionValidation';
import UserController from './app/controllers/UserController';
import MeetupController from './app/controllers/MeetupController';
import MeetupDetailController from './app/controllers/MeetupDetailController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OpenMeetupsController from './app/controllers/OpenMeetupsController';
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

routes.get('/meetups/:meetupId', MeetupDetailController.index);
routes.delete('/meetups/:meetupId', MeetupController.delete);
routes.put('/meetups/:meetupId/update', MeetupController.update);

routes.post('/subscriptions/:meetupId', SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);

routes.get('/openmeetups', OpenMeetupsController.index);

export default routes;
