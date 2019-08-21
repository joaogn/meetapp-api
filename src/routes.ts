import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import SessionValidation from './app/middlewares/SessionValidation';
import UserController from './app/controllers/UserController';
import { UserStoreValidation, UpdateStoreValidation } from './app/middlewares/UserValidation';
import AuthSession from './app/middlewares/auth';

const routes = Router();

routes.post('/sessions', SessionValidation, SessionController.store);
routes.post('/users', UserStoreValidation, UserController.store);
routes.use(AuthSession);
routes.put('/users', UpdateStoreValidation, UserController.update);

export default routes;
