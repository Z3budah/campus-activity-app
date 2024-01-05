import request from 'supertest';
import { app } from '../../app';
import instances from './instances';
import { Activity } from '../../model/activities';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/activities for post requests', async () => {
  const response = await request(app).post('/api/activities').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/activities').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send({
      title: '',
      capacity: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send({
      capacity: 10,
    })
    .expect(400);
});


it('creates a activity with valid inputs', async () => {
  let activity = await Activity.find({});
  expect(activity.length).toEqual(0);

  const activityIns = instances[0];


  await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send(activityIns)
    .expect(201);

  activity = await Activity.find({});
  expect(activity.length).toEqual(1);
  expect(activity[0].title).toEqual(activityIns.title);
});

it('publishes an event', async () => {
  const activityIns = instances[0];

  await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send(activityIns)
    .expect(201);

  // console.log(natsWrapper);
})