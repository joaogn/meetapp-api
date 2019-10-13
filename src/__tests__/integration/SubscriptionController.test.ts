import request from 'supertest';
import redis from 'redis-mock';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import { addHours } from 'date-fns';
import Mailer from 'nodemailer/lib/mailer';
import app from '../../app';
import factory, { UserTypes, MeetupType, FileType } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';
import Subscription from '../../app/models/Subscription';
import Queue from '../../lib/Queue';

redis.createClient();

let user:UserTypes = null;
let token = '';
let banner = null;
beforeEach(async () => {
  await truncate();
  user = await factory.create<UserTypes>('User');
  banner = await factory.create<FileType>('File');
});


describe('POST /subscriptions/:meetupId', () => {
  it('Should send email a new Subscription', async () => {
    jest.spyOn(Mailer.prototype, 'sendMail');
    Queue.processQueue();
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(Mailer.prototype.sendMail).toHaveBeenCalledTimes(1);
  });

  it('Should create new Subscription', async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body).sort()).toEqual(['id', 'meetup_id', 'user_id'].sort());
    expect(Number(response.body.meetup_id)).toBe(meetupId);
    expect(Number(response.body.user_id)).toBe(id);
  });

  it("should return { error: 'meetup not found' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .post(`/subscriptions/${1500}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'meetup not found' });
  });

  it("should return { error: 'Cannot sign up for own meetup' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      user_id: id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot sign up for own meetup' });
  });

  it("should return { error: 'this metup has passed' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'this metup has passed' });
  });

  it("should return { error: 'User is already subscribed to this meetup' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });

    await Subscription.create({ user_id: id, meetup_id: meetupId });

    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'User is already subscribed to this meetup' });
  });

  it("should return { error: 'Cannot subscribe to two meetups at the same time' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: newUserId } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      date: addHours(new Date(), 4),
      user_id: newUserId,
      banner_id: banner.id,
    });

    const { id: otherMeetupId } = await factory.create<MeetupType>('Meetup', {
      date: addHours(new Date(), 4),
      user_id: user.id,
      banner_id: banner.id,
    });

    await Subscription.create({ user_id: id, meetup_id: otherMeetupId });

    const response = await request(app)
      .post(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot subscribe to two meetups at the same time' });
  });
});

describe('GET /subscriptions', () => {
  it('Should return data from created subscriptions', async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const newUser = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const meetup1 = await factory.create<MeetupType>('Meetup', {
      date: addHours(new Date(), 2),
      user_id: newUser.id,
      banner_id: banner.id,
    });

    const meetup2 = await factory.create<MeetupType>('Meetup', {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      date: addHours(new Date(), 6),
      user_id: user.id,
      banner_id: banner.id,
    });

    await Subscription.create({ user_id: id, meetup_id: meetup1.id });
    await Subscription.create({ user_id: id, meetup_id: meetup2.id });

    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body[0]).sort()).toEqual(['id', 'meetup_id', 'user_id', 'meetups'].sort());
    expect(Object.keys(response.body[0].meetups).sort()).toEqual(
      [
        'past', 'title', 'description', 'location', 'date', 'banner_id', 'user', 'file',
      ].sort(),
    );
    expect(Object.keys(response.body[0].meetups.user).sort()).toEqual(['name', 'email'].sort());
    expect(Object.keys(response.body[0].meetups.file).sort()).toEqual(['url', 'path'].sort());
    expect(response.body[0].meetups.title).toBe(meetup2.title);
    expect(response.body[0].meetups.location).toBe(meetup2.location);
    expect(response.body[0].meetups.user.email).toBe(user.email);
    expect(response.body[0].meetups.file.url).toBe(banner.url);
    expect(response.body[1].meetups.title).toBe(meetup1.title);
    expect(response.body[1].meetups.location).toBe(meetup1.location);
    expect(response.body[1].meetups.user.email).toBe(newUser.email);
    expect(response.body[1].meetups.file.url).toBe(banner.url);
  });
});

describe('DELETE /subscriptions', () => {
  it('Should delete created subscription', async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      date: addHours(new Date(), 2),
      user_id: user.id,
      banner_id: banner.id,
    });

    const newSubscription = await Subscription.create({ user_id: id, meetup_id: meetupId });

    const response = await request(app)
      .delete(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const subscription = await Subscription.findByPk(newSubscription.id);
    expect(response.status).toBe(200);
    expect(subscription).toBe(null);
  });

  it("should return { error: 'Meetup not found' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .delete(`/subscriptions/${1500}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Meetup not found' });
  });


  it("should return { error: 'You cannot cancel a past meetup' }", async () => {
    const { id } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    const payload = { id };
    token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });

    const { id: meetupId } = await factory.create<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });

    await Subscription.create({ user_id: id, meetup_id: meetupId });

    const response = await request(app)
      .delete(`/subscriptions/${meetupId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'You cannot cancel a past meetup' });
  });
});
