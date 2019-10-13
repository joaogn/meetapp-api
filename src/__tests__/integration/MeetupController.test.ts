import request from 'supertest';
import redis from 'redis-mock';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import app from '../../app';
import factory, { UserTypes, MeetupType, FileType } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';
import Meetup from '../../app/models/Meetup';

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

describe('POST /meetups', () => {
  it('Should create new Meetup', async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(meetup);
    expect(response.status).toBe(200);
    expect(Object.keys(response.body).sort()).toEqual(
      [
        'id', 'past', 'title', 'description', 'location', 'date', 'banner_id', 'user_id',
      ].sort(),
    );
    expect(response.body.title).toBe(meetup.title);
    expect(response.body.description).toBe(meetup.description);
    expect(response.body.user_id).toBe(meetup.user_id);
    expect(response.body.banner_id).toBe(meetup.banner_id);
  });

  it("should return { error: 'You already have a registered meetup in the next hour' }", async () => {
    const { date } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      date,
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(meetup);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'You already have a registered meetup in the next hour' });
  });

  it(`should return { error:${"Can't register date has passed"}  }`, async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(meetup);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Can't register date has passed" });
  });

  it("should return { error:'Title is Required'  }", async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ ...meetup, title: undefined });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Title is Required' });
  });

  it("should return { error:'Description is Required'  }", async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ ...meetup, description: undefined });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Description is Required' });
  });

  it("should return { error:'Location is Required'  }", async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ ...meetup, location: undefined });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Location is Required' });
  });

  it("should return { error:'Date is Required'  }", async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ ...meetup, date: undefined });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Date is Required' });
  });

  it("should return { error:'Invalid date format.'  }", async () => {
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ ...meetup, date: '2019-02-35T18:01:10.883Z' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid date format.' });
  });
});


describe('GET /meetups', () => {
  it('Should return data from created meetup', async () => {
    const { title } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const {
      title: title2,
    } = await factory.create<MeetupType>('Meetup', {
      title: faker.lorem.sentence(),
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body[0]).sort()).toEqual(['id', 'title', 'date'].sort());
    expect(response.body[0].title).toBe(title);
    expect(response.body[1].title).toBe(title2);
  });
});


describe('PUT /meetups', () => {
  it('Should return data from updated meetup', async () => {
    const { id } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const meetup = await factory.attrs<MeetupType>('Meetup', {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      date: faker.date.future(0),
      banner_id: banner.id,
    });
    const response = await request(app)
      .put(`/meetups/${id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(meetup);
    expect(response.status).toBe(200);
    expect(Object.keys(response.body).sort()).toEqual(
      [
        'id', 'past', 'title', 'description', 'location', 'date', 'banner_id', 'user_id',
      ].sort(),
    );
    expect(response.body.title).toBe(meetup.title);
    expect(response.body.location).toBe(meetup.location);
    expect(response.body.description).toBe(meetup.description);
  });

  it("should return { error:'meetup not found' }", async () => {
    const { title, location, date } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .put(`/meetups/${1000}/update`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title, location, date });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'meetup not found' });
  });

  it(`should return { error:${"can't update past meetups"}  }`, async () => {
    const {
      id, title, location, date,
    } = await factory.create<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .put(`/meetups/${id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title, location, date });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "can't update past meetups" });
  });

  it("should return { error:'this meetup does not currently belong to this user' }", async () => {
    const {
      id, title, location, date,
    } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const { id: userId } = await factory.create<UserTypes>('User', {
      name: faker.name.findName(),
      email: faker.internet.email(),
    });
    const payload = { id: userId };
    const newToken = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put(`/meetups/${id}/update`)
      .set('Authorization', `Bearer ${newToken}`)
      .set('Content-Type', 'application/json')
      .send({ title, location, date });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'this meetup does not currently belong to this user' });
  });

  it("should return { error: 'Invalid date format.'  }", async () => {
    const { id, title, location } = await factory.create<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .put(`/meetups/${id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ title, location, date: '2019-02-35T18:01:10.883Z' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid date format.' });
  });
});

describe('DELETE /meetups', () => {
  it('should delete created meetup', async () => {
    const { id } = await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .delete(`/meetups/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    const meetup = await Meetup.findByPk(id);
    expect(response.status).toBe(200);
    expect(meetup).toBe(null);
  });

  it("should return { error:'meetup not found' }", async () => {
    await factory.create<MeetupType>('Meetup', {
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .delete(`/meetups/${1000}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'meetup not found' });
  });

  it(`should return { error:${"can't update past meetups"}  }`, async () => {
    const { id } = await factory.create<MeetupType>('Meetup', {
      date: faker.date.past(),
      user_id: user.id,
      banner_id: banner.id,
    });
    const response = await request(app)
      .delete(`/meetups/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "can't delete past meetups" });
  });
});
