import request from 'supertest';
import redis from 'redis-mock';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import app from '../../app';
import factory, { UserTypes } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';

redis.createClient();

describe('POST /session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return user and token', async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const response = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({ email, password: '123456' });
    const decoded:any = await promisify(jwt.verify)(response.body.token, authConfig.secret);
    expect(decoded.id).toBe(id);
    expect(Object.keys(response.body).sort()).toEqual(['user', 'token'].sort());
    expect(Object.keys(response.body.user).sort()).toEqual(['id', 'name', 'email'].sort());
    expect(response.body.user.name).toBe(name);
    expect(response.body.user.email).toBe(email);
  });

  it("should return { error: 'User not found' }", async () => {
    await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const response = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({ email: 'wrong@email.com', password: '12345678' });
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  it("should return { error: 'Password does not match' }", async () => {
    const { email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const response = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({ email, password: '12345678' });
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ error: 'Password does not match' });
  });

  it("should return { error: 'Email is Required' }", async () => {
    await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const response = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({ email: undefined, password: '12345678' });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Email is Required' });
  });

  it("should return { error: 'Password is Required' }", async () => {
    const { email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const response = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({ email, password: undefined });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Password is Required' });
  });
});
