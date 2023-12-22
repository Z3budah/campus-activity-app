import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../../app'
import { Activity } from '../../model/activity';
import { Registration } from '../../model/registration';

const buildActivity = async () => {
  const activity = Activity.build({
    title: 'new activity',
    time: { start: new Date('2018-10-29T09:00:00'), end: new Date('2018-10-29T18:00:00') },
    capacity: "No Limited",
    state: 2,
  })

  await activity.save();
  return activity;
}

it('fetches regs for a particular user', async () => {
  const act1 = await buildActivity();
  const act2 = await buildActivity();
  const act3 = await buildActivity();

  const user1 = global.signin();
  const user2 = global.signin();

  //registration for user1
  await request(app)
    .post('/api/regs')
    .set('Cookie', user1)
    .send({ activityId: act1.id })
    .expect(201);

  //registrations for user2
  const { body: reg1 } = await request(app)
    .post('/api/regs')
    .set('Cookie', user2)
    .send({ activityId: act2.id })
    .expect(201);
  const { body: reg2 } = await request(app)
    .post('/api/regs')
    .set('Cookie', user2)
    .send({ activityId: act3.id })
    .expect(201);

  const response = await request(app)
    .get('/api/regs')
    .set('Cookie', user2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(reg1.id);
  expect(response.body[1].id).toEqual(reg2.id);
  expect(response.body[0].activity.id).toEqual(act2.id);
  expect(response.body[1].activity.id).toEqual(act3.id);
})