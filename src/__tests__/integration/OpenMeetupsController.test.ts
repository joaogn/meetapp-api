import request from 'supertest';
import redis from 'redis-mock';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import {
  setHours, subDays, format, addDays,
} from 'date-fns';
import app from '../../app';
import factory, { UserTypes, MeetupType, FileType } from '../factories';
import Subscription from '../../app/models/Subscription';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';

redis.createClient();

beforeEach(async () => {
  await truncate();
});

describe('GET /openmeetups', () => {
  it('Should return data from created meetup', async () => {
    const user = await factory.create<UserTypes>('User');
    const file = await factory.create<FileType>('File');

    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });


    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    await factory.create<MeetupType>('Meetup', {
      date: addDays(setHours(new Date(), 8), 1),
      user_id: id,
      banner_id: file.id,
    });
    const meetup1 = await factory.create<MeetupType>('Meetup', {
      date: addDays(setHours(new Date(), 8), 1),
      user_id: user.id,
      banner_id: file.id,
    });
    const meetup2 = await factory.create<MeetupType>('Meetup', {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      date: addDays(setHours(new Date(), 10), 1),
      user_id: user.id,
      banner_id: file.id,
    });
    await factory.create<MeetupType>('Meetup', {
      date: subDays(new Date(), 2),
      user_id: user.id,
      banner_id: file.id,
    });
    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      date: addDays(setHours(new Date(), 12), 1),
      user_id: user.id,
      banner_id: file.id,
    });

    Subscription.create({ user_id: id, meetup_id: meetupId });

    const response = await request(app)
      .get(`/openmeetups/?date=${format(addDays(new Date(), 1), 'yyyy-MM-dd')}&page=1`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body[0]).sort()).toEqual(
      [
        'past', 'id', 'title', 'description', 'location', 'date', 'banner_id', 'user_id', 'user', 'file',
      ].sort(),
    );
    expect(Object.keys(response.body[0].user).sort()).toEqual(['name', 'email'].sort());
    expect(Object.keys(response.body[0].file).sort()).toEqual(['url', 'path'].sort());
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe(meetup1.title);
    expect(response.body[0].location).toBe(meetup1.location);
    expect(response.body[0].user.email).toBe(user.email);
    expect(response.body[0].file.url).toBe(file.url);
    expect(response.body[1].title).toBe(meetup2.title);
    expect(response.body[1].location).toBe(meetup2.location);
    expect(response.body[1].user.email).toBe(user.email);
    expect(response.body[1].file.url).toBe(file.url);
  });
});
