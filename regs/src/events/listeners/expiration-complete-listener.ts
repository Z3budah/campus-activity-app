import { Listener, Subjects, ExpirationCompleteEvent, RegStatus } from "@zecamact/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Registration } from "../../model/registration"
import { RegCancelledPublisher } from "../publishers/reg-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const reg = await Registration.findById(data.regId).populate('activity');

    if (!reg) {
      throw new Error('egistration not found');
    }

    reg.set({
      status: RegStatus.Cancelled,
    });

    await reg.save();

    await new RegCancelledPublisher(natsWrapper.client).publish({
      id: reg.id,
      version: reg.version,
      userId: reg.userId,
      activity: {
        id: reg.activity.id
      }
    });

    msg.ack();
  }
}