import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import instances from './instances';
import { Activity } from '../../model/activities';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/activities/${id}`).set('Cookie', global.signin())
    .send(instances[0])
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/activities/${id}`)
    .send(instances[0])
    .expect(401);
});

it('returns a 401 if the user does not own the activity', async () => {
  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', global.signin())
    .send(instances[0]);

  await request(app)
    .put(`/api/activities/${response.body.id}`)
    .set('Cookie', global.signin())
    .send(instances[0])
    .expect(401);
});

it('returns a 400 if the user provides an invalid title', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', cookie)
    .send(instances[0]);

  await request(app)
    .put(`/api/activities/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '' })
    .expect(400);

  await request(app)
    .put(`/api/activities/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      state: -1
    })
    .expect(400);

});

it('updates the activity provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', cookie)
    .send(instances[0]);

  await request(app)
    .put(`/api/activities/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      // title:'new title',
      state: 1
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/activities/${response.body.id}`)
    .send();


  // expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.state).toEqual(1);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/activities')
    .set('Cookie', cookie)
    .send(instances[0]);

  await request(app)
    .put(`/api/activities/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      state: 1
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})