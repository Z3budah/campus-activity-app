import { Message } from "node-nats-streaming";
import { Subjects, Listener, ActivityCreatedEvent } from "@zecamact/common";
import { Activity } from "../../model/activity";
import { queueGroupName } from "./queue-group-name";

export class ActivityCreatedListener extends Listener<ActivityCreatedEvent>{
  subject: Subjects.ActivityCreated = Subjects.ActivityCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: ActivityCreatedEvent['data'], msg: Message) {
    const { id, title, time, capacity, state } = data;

    const activity = Activity.build({
      id,
      title,
      time,
      capacity,
      state,
    });

    await activity.save();

    msg.ack();
  }
}