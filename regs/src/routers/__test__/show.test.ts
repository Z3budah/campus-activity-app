import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../../app'
import { Activity } from '../../model/activity';
it('fetches the registration', async () => {
  const activity = Activity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new activity',
    time: { start: new Date('2018-10-29T09:00:00'), end: new Date('2018-10-29T18:00:00') },
    capacity: "No Limited",
    state: 2,
  })

  await activity.save();

  const user = global.signin();

  const { body: reg } = await request(app)
    .post('/api/regs')
    .set('Cookie', user)
    .send({ activityId: activity.id })
    .expect(201);

  const { body: fetchedReg } = await request(app)
    .get(`/api/regs/${reg.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(fetchedReg.id).toEqual(reg.id);
});

it('return an error if one user tries to fetch another users registration', async () => {
  const activity = Activity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new activity',
    time: { start: new Date('2018-10-29T09:00:00'), end: new Date('2018-10-29T18:00:00') },
    capacity: "No Limited",
    state: 2,
  })

  await activity.save();

  const user = global.signin();

  const { body: reg } = await request(app)
    .post('/api/regs')
    .set('Cookie', user)
    .send({ activityId: activity.id })
    .expect(201);

  await request(app)
    .get(`/api/regs/${reg.id}`)
    .set('Cookie', global.signin())
    .expect(401);

});