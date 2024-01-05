import { Listener, RegCreatedEvent, Subjects } from "@zecamact/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Activity } from "../../model/activities";
import { ActivityUpdatedPublisher } from "../publishers/activity-updated-publisher";
export class RegCreatedListener extends Listener<RegCreatedEvent>{
  subject: Subjects.RegCreated = Subjects.RegCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: RegCreatedEvent['data'], msg: Message) {
    //find the activity that for the reg 
    const activity = await Activity.findById(data.activity.id);
    //if no, throw an err
    if (!activity) {
      throw new Error('Activity not found');
    }
    //add the reg:id to the activity regsId[]
    if (activity.regsId) {
      activity.regsId.push(data.id);
    } else {
      activity.regsId = [data.id];
    }

    activity.set({ regsId: activity.regsId });
    //save the activity
    await activity.save();
    new ActivityUpdatedPublisher(this.client).publish({
      id: activity.id,
      version: activity.version,
      title: activity.title,
      description: activity.description,
      time: activity.time,
      location: activity.location,
      actype: activity.actype,
      score: activity.score,
      capacity: activity.capacity,
      pubId: activity.pubId,
      state: activity.state,
      regsId: activity.regsId
    });
    //ack the msg
    msg.ack();
  }
}