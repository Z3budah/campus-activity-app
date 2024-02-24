import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Message } from "node-nats-streaming";

import { natsWrapper } from "../../../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Registration } from "../../../model/registration";
import { Activity } from "../../../model/activity";
import { RegStatus, ExpirationCompleteEvent } from "@zecamact/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const activity = Activity.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "校园环保日志愿活动",
    time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
    capacity: "No Limited",
    state: 0,
  });
  await activity.save();

  const reg = Registration.build({
    status: RegStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    activity
  });

  await reg.save();

  const data: ExpirationCompleteEvent['data'] = {
    regId: reg.id
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, reg, data, msg };
}

it('updates the reg status to cancelled', async () => {
  const { listener, reg, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedReg = await Registration.findById(reg.id);
  expect(updatedReg!.status).toEqual(RegStatus.Cancelled);
})
it('emits a RegCancelled event', async () => {
  const { listener, reg, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(reg.id);
})
it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
})