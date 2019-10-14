import request from 'supertest';
import redis from 'redis-mock';
import faker from 'faker';
import app from '../../app';
import truncate from '../util/truncate';

redis.createClient();

beforeEach(async () => {
  await truncate();
});

describe('Auth Middleware', () => {
  it("should return { error: 'Token not provided' }", async () => {
    const response = await request(app)
      .put('/users')
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ error: 'Token not provided' });
  });
  it("should return { error: 'Invalid token' }", async () => {
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${faker.random.uuid}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ error: 'Invalid token' });
  });
});
