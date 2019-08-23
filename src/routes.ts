import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import SessionValidation from './app/middlewares/SessionValidation';
import UserController from './app/controllers/UserController';
import { UserStoreValidation, UpdateStoreValidation } from './app/middlewares/UserValidation';
import AuthSession from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidation, SessionController.store);
routes.post('/users', UserStoreValidation, UserController.store);
routes.use(AuthSession);
routes.put('/users', UpdateStoreValidation, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
