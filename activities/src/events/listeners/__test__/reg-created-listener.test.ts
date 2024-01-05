import { Message } from "node-nats-streaming";
import { RegCreatedEvent, RegStatus } from "@zecamact/common";
import { RegCreatedListener } from "../reg-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Activity } from "../../../model/activities";

const setup = async () => {
  //listener
  const listener = new RegCreatedListener(natsWrapper.client);
  //creat & save an activity
  const activity = Activity.build({
    title: "校园环保日志愿活动",
    description: "参与环保志愿者活动，共同营造绿色校园。",
    time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
    location: { text: '校园各处' },
    actype: 'moral',
    score: 0.5,
    capacity: "No Limited",
    state: 0,
    pubId: new mongoose.Types.ObjectId().toHexString(),
  });
  await activity.save();

  //data event
  const data: RegCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: activity.version,
    status: RegStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: activity.time.end.toString(),
    activity: {
      id: activity.id,
      title: activity.title,
      time: activity.time,
      capacity: activity.state,
      state: activity.state,
    },
  }
  //msg obj
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, activity, data, msg };
}

it('add the reg:id to the activity:regsId[]', async () => {
  const { listener, activity, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedActivity = await Activity.findById(activity.id);

  expect(updatedActivity!.regsId).toContain(data.id);
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

  expect(activityUpdatedData.regsId).toContain(data.id);
});