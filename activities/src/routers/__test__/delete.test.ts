import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import instances from './instances';
import { Activity } from '../../model/activities';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/activities/${id}`).set('Cookie', global.signin())
    .send()
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .delete(`/api/activities/${id}`)
    .send()
    .expect(401);
});

it('returns a 401 if the user does not own the activity', async () => {
  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send(instances[0]);

  await request(app)
    .delete(`/api/activities/${response.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});


it('delete the activity created by the same user', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', cookie)
    .send(instances[0]);

  let activity = await Activity.find({});
  expect(activity.length).toEqual(1);
  
  await request(app)
    .delete(`/api/activities/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

    activity = await Activity.find({});
    expect(activity.length).toEqual(0);
});
