import request from 'supertest';
import redis from 'redis-mock';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../../app';
import factory, { UserTypes } from '../factories';
import truncate from '../util/truncate';
import authConfig from '../../config/auth';
import User from '../../app/models/User';

redis.createClient();

describe('POST /users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create<UserTypes>('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should return new user', async () => {
    const newUser = await factory.attrs<UserTypes>('User');
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(newUser);
    expect(response.status).toEqual(200);
    expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'email'].sort());
    expect(response.body.name).toEqual(newUser.name);
    expect(response.body.email).toEqual(newUser.email);
  });

  it("should return { error: 'User already exists.' }", async () => {
    const { name, email, password } = await factory.create<UserTypes>('User');
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        name,
        email,
        password,
      });
    expect(response.body).toEqual({ error: 'User already exists.' });
  });

  it("should return { error: 'Name is Required' }", async () => {
    const newUser = await factory.attrs<UserTypes>('User');
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...newUser, name: undefined });
    expect(response.body).toEqual({ error: 'Name is Required' });
  });

  it("should return { error: 'Email is Required' }", async () => {
    const newUser = await factory.attrs<UserTypes>('User');
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...newUser, email: undefined });
    expect(response.body).toEqual({ error: 'Email is Required' });
  });

  it("should return { error: 'Password is Required' }", async () => {
    const newUser = await factory.attrs<UserTypes>('User');
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ ...newUser, password: undefined });
    expect(response.body).toEqual({ error: 'Password is Required' });
  });
});

describe('PUT /users', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should updated user name and email', async () => {
    const { id } = await factory.create<UserTypes>('User');
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const { name, email } = await factory.attrs<UserTypes>('User', {
      name: 'João',
      email: 'joao@gmail.com',
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ name, email });
    expect(response.status).toEqual(200);
    expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'email'].sort());
    expect(response.body.name).toEqual(name);
    expect(response.body.email).toEqual(email);
  });

  it('should updated user password', async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        name, email, oldPassword: '123456', password: '12345678', confirmPassword: '12345678',
      });
    expect(response.status).toEqual(200);
    const user = await User.findByPk(id);
    const compareHash = await bcrypt.compare('12345678', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it("should return { error: 'Email already exists.' }", async () => {
    const { id, name } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const { email } = await factory.create<UserTypes>('User', {
      name: 'João',
      email: 'joao@gmail.com',
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ name, email });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Email already exists.' });
  });

  it("should return { error: 'Password does not match' }", async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        name, email, oldPassword: '1234567', password: '12345678', confirmPassword: '12345678',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Password does not match' });
  });

  it("should return { error: 'Password is Required' }", async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        name, email, oldPassword: '123456', password: undefined, confirmPassword: '12345678',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Password is Required' });
  });

  it("should return { error: 'Confirm Password is Required' }", async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        name, email, oldPassword: '123456', password: '12345678', confirmPassword: undefined,
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Confirm Password is Required' });
  });

  it("should return { error: 'Confirm Password is Wrong' }", async () => {
    const { id, name, email } = await factory.create<UserTypes>('User', {
      password: '123456',
    });
    const payload = { id };
    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: 300,
    });
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        name, email, oldPassword: '123456', password: '12345678', confirmPassword: '123456789',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Confirm Password is Wrong' });
  });
});
