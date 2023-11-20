import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import instances from './instances';

it('returns a 404 if the activity is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/activities/${id}`).send().expect(404);
});

it('returns the  if the activity is found', async () => {
  const activityIns = instances[0];

  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send(activityIns)
    .expect(201);
  
  const activityResponse = await request(app)
    .get(`/api/activities/${response.body.id}`)
    .send()
    .expect(200);

  expect(activityResponse.body.title).toEqual(activityIns.title);
  expect(activityResponse.body.state).toEqual(activityIns.state);
});
