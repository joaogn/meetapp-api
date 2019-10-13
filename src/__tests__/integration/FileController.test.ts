import request from 'supertest';
import redis from 'redis-mock';
import path from 'path';
import jwt from 'jsonwebtoken';
import app from '../../app';
import factory, { UserTypes } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';

redis.createClient();


describe('POST /files', () => {
  const filePath = path.resolve(__dirname, '..', 'files', 'meetup-test.jpg');
  let token = '';

  beforeEach(async () => {
    await truncate();
    const { id } = await factory.create<UserTypes>('User');
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
  });

  it('Shoud create new File in database', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', filePath)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'path', 'url'].sort());
    expect(response.body.name).toBe('meetup-test.jpg');
  });

  it("should return { error: 'image file not found' }", async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', undefined)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'image file not found' });
  });
});
