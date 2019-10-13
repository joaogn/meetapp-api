import request from 'supertest';
import redis from 'redis-mock';
import jwt from 'jsonwebtoken';
import app from '../../app';
import factory, { UserTypes, MeetupType, FileType } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';

redis.createClient();

let user:UserTypes = null;
let token = '';
let banner = null;
beforeEach(async () => {
  await truncate();
  user = await factory.create<UserTypes>('User');
  const payload = { id: user.id };
  token = jwt.sign(payload, authConfig.secret, {
    expiresIn: 300,
  });
  banner = await factory.create<FileType>('File');
});

describe('GET /meetups', () => {
  it('Should return data from created meetup', async () => {
    const {
      id, title, location, description,
    } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .get(`/meetups/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(Object.keys(response.body).sort()).toEqual(
      [
        'past', 'title', 'description', 'location', 'date', 'banner_id', 'file',
      ].sort(),
    );
    expect(Object.keys(response.body.file).sort()).toEqual(['url', 'path'].sort());
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(title);
    expect(response.body.location).toBe(location);
    expect(response.body.description).toBe(description);
    expect(response.body.file.url).toBe(banner.url);
  });
});
