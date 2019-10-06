import 'dotenv/config';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import routes from './routes';
import sentryConfig from './config/sentry';

class App {
  server: express.Express;

  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlerware();
    this.routes();
    this.exceptionHandlers();
  }

  middlerware():void {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
    );
    if (process.env.NODE_ENV !== 'development') {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: Number(process.env.REDIS_PORT),
            }),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        }),
      );
    }
  }

  routes():void {
    this.server.use(routes);
  }

  exceptionHandlers() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
