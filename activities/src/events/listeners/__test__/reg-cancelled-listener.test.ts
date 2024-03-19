import { Message } from "node-nats-streaming";
import { RegCancelledEvent, RegStatus } from "@zecamact/common";
import { RegCancelledListener } from "../reg-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Activity } from "../../../model/activities";

const setup = async () => {
  //listener
  const listener = new RegCancelledListener(natsWrapper.client);
  const regId = new mongoose.Types.ObjectId().toHexString();
  //creat & save an activity

  const activity = Activity.build({
    title: "校园环保日志愿活动",
    description: "参与环保志愿者活动，共同营造绿色校园。",
    time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
    location: { text: '校园各处' },
    actype: 'moral',
    score: 0.5,
    pictures: [],
    capacity: "No Limited",
    state: 0,
    pubId: new mongoose.Types.ObjectId().toHexString(),
  });
  activity.set({ regsId: [regId, new mongoose.Types.ObjectId().toHexString()] });
  await activity.save();

  //data event
  const data: RegCancelledEvent['data'] = {
    id: regId,
    version: activity.version,
    userId: new mongoose.Types.ObjectId().toHexString(),
    activity: {
      id: activity.id
    },
  }
  //msg obj
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, activity, data, msg, regId };
}

it('remove the reg:id from the activity:regsId[]', async () => {
  const { listener, activity, data, msg, regId } = await setup();

  await listener.onMessage(data, msg);

  const updatedActivity = await Activity.findById(activity.id);

  expect(updatedActivity!.regsId).not.toContain(data.id);
});

it('acks the msg', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes an activity updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const activityUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(activityUpdatedData.regsId).not.toContain(data.id);
});