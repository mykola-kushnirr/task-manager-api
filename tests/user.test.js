const request = require('supertest');
const env = require('../test.env.json');
process.env = {
  ...process.env,
  ...env,
};

const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'One',
  email: 'one@qqq.com',
  password: 'Pass@1234',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Sherlock',
      email: `sh@qwe.com`,
      password: 'Pass@1234',
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBe(null);

  expect(response.body).toMatchObject({
    user: {
      name: 'Sherlock',
      email: 'sh@qwe.com',
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('Pass@1234');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'userOne.password',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for nonauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete acc for nonauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});
