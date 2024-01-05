import { Message } from "node-nats-streaming";
import { ActivityUpdatedEvent } from "@zecamact/common";
import { ActivityUpdatedListener } from "../activity-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Activity } from "../../../model/activity";
const setup = async () => {
  //listener
  const listener = new ActivityUpdatedListener(natsWrapper.client);
  //create & save an activity

  const activity = Activity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "校园环保日志愿活动",
    time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
    capacity: "No Limited",
    state: 0,
  });
  await activity.save();
  //data obj
  const data: ActivityUpdatedEvent['data'] = {
    id: activity.id,
    title: "地铁志愿活动",
    description: "参与地铁志愿者活动，维护秩序。",
    time: activity.time,
    location: { text: '本市地铁站' },
    actype: 'moral',
    score: 0.5,
    capacity: activity.capacity,
    state: activity.state,
    pubId: new mongoose.Types.ObjectId().toHexString(),
    version: activity.version + 1,
  };
  //msg obj
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg, activity };
}

it('finds & updates an activity', async () => {
  const { listener, data, msg, activity } = await setup();

  await listener.onMessage(data, msg);

  const updatedActivity = await Activity.findById(activity.id);

  expect(updatedActivity!.title).toEqual(data.title);
});

it('acks the msg', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version', async () => {
  const { listener, data, msg, activity } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) { }

  expect(msg.ack).not.toHaveBeenCalled();
});