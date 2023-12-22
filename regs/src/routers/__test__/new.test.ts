import request from 'supertest';
import mongoose from "mongoose";
import { app } from '../../app'
import { Activity } from '../../model/activity';
import { Registration } from '../../model/registration';


it('return an error if the activity does not exist', async () => {
  const activityId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/regs')
    .set('Cookie', global.signin())
    .send({ activityId })
    .expect(404);
});



it('return an error if the activity is not avalible', async () => {
  //wrong state
  const activity = Activity.build({
    title: 'new activity',
    time: { start: new Date('2018-10-29T09:00:00'), end: new Date('2018-10-29T18:00:00') },
    capacity: "No Limited",
    state: 3,
  })

  await activity.save();


  await request(app)
    .post('/api/regs')
    .set('Cookie', global.signin())
    .send({ activityId: activity.id })
    .expect(400);

  activity.set({ capacity: 1, state: 2 });
  activity.save();

  // register an activity
  await request(app)
    .post('/api/regs')
    .set('Cookie', global.signin())
    .send({ activityId: activity.id })
    .expect(201);

  //Exceeded capacity
  const regscount = await Registration.countDocuments({ activity: activity });

  await request(app)
    .post('/api/regs')
    .set('Cookie', global.signin())
    .send({ activityId: activity.id })
    .expect(400);

});
