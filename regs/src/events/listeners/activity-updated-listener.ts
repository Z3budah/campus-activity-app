import { Message } from "node-nats-streaming";
import { Subjects, Listener, ActivityUpdatedEvent } from "@zecamact/common";
import { Activity } from "../../model/activity";
import { queueGroupName } from "./queue-group-name";

export class ActivityUpdatedListener extends Listener<ActivityUpdatedEvent>{
  subject: Subjects.ActivityUpdated = Subjects.ActivityUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: ActivityUpdatedEvent['data'], msg: Message) {
    const activity = await Activity.findByEvent(data);

    if (!activity) {
      throw new Error('Activity not found');
    }
    const { title, time, capacity, state } = data;
    activity.set({ title, time, capacity, state });

    await activity.save();

    msg.ack();
  }
}