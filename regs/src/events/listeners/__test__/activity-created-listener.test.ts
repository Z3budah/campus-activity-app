import { Message } from "node-nats-streaming";
import { ActivityCreatedEvent } from "@zecamact/common";
import { ActivityCreatedListener } from "../activity-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Activity } from "../../../model/activity";
const setup = async () => {
  //listener
  const listener = new ActivityCreatedListener(natsWrapper.client);
  //data event
  const data: ActivityCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "校园环保日志愿活动",
    description: "参与环保志愿者活动，共同营造绿色校园。",
    time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
    location: { text: '校园各处' },
    actype: 'moral',
    score: 0.5,
    capacity: "No Limited",
    state: 0,
    pubId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  }
  //msg obj
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
}

it('creates and saves an activity', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const activity = await Activity.findById(data.id);

  expect(activity).toBeDefined();
  expect(activity!.title).toEqual(data.title);

});
it('acks the msg', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
