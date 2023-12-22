import request from 'supertest';
import { app } from '../../app'
import { Activity } from '../../model/activity';
import { RegStatus } from '@zecamact/common';
import { Registration } from '../../model/registration';

it('marks an registration as cancelled', async () => {
  const activity = Activity.build({
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
    .delete(`/api/regs/${reg.id}`)
    .set('Cookie', user)
    .expect(204);

  const cancelReg = await Registration.findById(reg.id);

  expect(cancelReg!.status).toEqual(RegStatus.Cancelled);

});