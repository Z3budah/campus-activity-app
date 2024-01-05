import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Registration } from "./registration";

interface ActivityAttrs {
  id: string,
  title: string;
  time: { start: Date; end: Date };
  capacity: number | string;
  state: number;
}
/*
case 0:
  return '待审核';
case 1:
  return '不通过';
case 2:
  return '进行中';
case 3:
  return '已完成';
*/

export interface ActivityDoc extends mongoose.Document {
  title: string;
  time: { start: Date; end: Date };
  capacity: number | string;
  state: number;
  version: number;
  isAvailable: () => Promise<boolean>;
}

interface ActivityModel extends mongoose.Model<ActivityDoc> {
  build(attrs: ActivityAttrs): ActivityDoc;
  findByEvent(event: { id: string, version: number }): Promise<ActivityDoc | null>;
}

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Object,
    required: true,
  },
  capacity: {
    type: Schema.Types.Mixed,
  },
  state: {
    type: Number,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

activitySchema.set('versionKey', 'version');
activitySchema.plugin(updateIfCurrentPlugin);

activitySchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Activity.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
activitySchema.statics.build = (attrs: ActivityAttrs) => {
  return new Activity({
    _id: attrs.id,
    title: attrs.title,
    time: attrs.time,
    capacity: attrs.capacity,
    state: attrs.state,
  });
}

activitySchema.methods.isAvailable = async function () {
  //available: 1.state=2 2.capacity>registrations
  if (this.state != 2) return false;
  if (Number.isInteger(this.capacity)) {
    const regscount = await Registration.countDocuments({ activity: this });
    return regscount < this.capacity;
  }
  return true;
}

const Activity = mongoose.model<ActivityDoc, ActivityModel>('Activity', activitySchema);

export { Activity }