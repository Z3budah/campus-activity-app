import { Activity } from "../activities";
import mongoose from "mongoose";

const instance = {
  title: "校园环保日志愿活动",
  description: "参与环保志愿者活动，共同营造绿色校园。",
  time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
  location: { text: '校园各处' },
  actype: 'moral',
  score: 0.5,
  pictures: [],
  capacity: "No Limited",
  state: 0,
  pubId: '123'
};

//OCC
it('implements optimistic concurrency control', async () => {
  //create
  const actvity = Activity.build(instance);
  //save
  await actvity.save();
  //fetch it twice
  const firstIns = await Activity.findById(actvity.id);
  const secondIns = await Activity.findById(actvity.id);

  //separately change the fetched instances
  firstIns!.set({ state: 1 });
  secondIns!.set({ state: 2 });

  //save ins1
  await firstIns!.save();
  //save ins2 expect an err
  try {
    await secondIns!.save();
    throw new Error('Should not reach this point')
  } catch (err) {
    expect(err).toBeInstanceOf(mongoose.Error.VersionError)
  }
});

it('increments the version on multiple saves', async () => {
  const actvity = Activity.build(instance);
  await actvity.save();
  expect(actvity.version).toEqual(0);
  await actvity.save();
  expect(actvity.version).toEqual(1);
  await actvity.save();
  expect(actvity.version).toEqual(2);
})