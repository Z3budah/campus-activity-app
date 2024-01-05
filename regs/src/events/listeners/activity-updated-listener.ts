import { Message } from "node-nats-streaming";
import { Subjects, Listener, ActivityUpdatedEvent } from "@zecamact/common";
import { Activity } from "../../model/activity";
import { queueGroupName } from "./queue-group-name";

export class ActivityUpdatedListener extends Listener<ActivityUpdatedEvent>{
  subject: Subjects.ActivityUpdated = Subjects.ActivityUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: ActivityUpdatedEvent['data'], msg: Message) {
    const { title, time, capacity, state } = data;

    const activity = await Activity.findById(data.id);
    if (!activity) {
      throw new Error('Activity not found');
    }

    activity.set({ title, time, capacity, state });

    await activity.save();

    msg.ack();
  }
}