import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import SessionValidation from './app/validators/SessionValidation';
import UserController from './app/controllers/UserController';
import MeetupController from './app/controllers/MeetupController';
import MeetupDetailController from './app/controllers/MeetupDetailController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OpenMeetupsController from './app/controllers/OpenMeetupsController';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';
import AuthSession from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidation, SessionController.store);
routes.post('/users', validateUserStore, UserController.store);
routes.use(AuthSession);
routes.put('/users', validateUserUpdate, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', validateMeetupStore, MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:meetupId/update', validateMeetupUpdate, MeetupController.update);
routes.delete('/meetups/:meetupId', MeetupController.delete);


routes.get('/meetups/:meetupId', MeetupDetailController.index);

routes.post('/subscriptions/:meetupId', SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);
routes.delete('/subscriptions/:meetupId', SubscriptionController.delete);

routes.get('/openmeetups', OpenMeetupsController.index);

export default routes;
