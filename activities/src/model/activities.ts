import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ActivityAttrs {
  title: string;
  description: string;
  time: { start: Date; end: Date };
  location: { text: string; map?: { latitude: number; longtitude: number } };
  actype: string;
  score: number | string;
  capacity: number | string;
  pubId: string;
  pictures: string[];
  state: number;
}

interface ActivityDoc extends mongoose.Document {
  title: string;
  description: string;
  time: { start: Date; end: Date };
  location: { text: string; map?: { latitude: number; longtitude: number } };
  actype: string;
  score: number | string;
  capacity: number | string;
  pubId: string;
  state: number;
  version: number;
  pictures: string[];
  regsId?: string[];
}

interface ActivityModel extends mongoose.Model<ActivityDoc> {
  build(attrs: ActivityAttrs): ActivityDoc;
}

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    time: {
      type: Object,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    actype: {
      type: String,
      enum: ['moral', 'intellectual', 'culsport'],
      required: true,
    },
    score: {
      type: Schema.Types.Mixed,
    },
    capacity: {
      type: Schema.Types.Mixed,
    },
    pubId: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    pictures: {
      type: [String],
    },
    regsId: {
      type: [String],
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

activitySchema.set('versionKey', 'version');
activitySchema.plugin(updateIfCurrentPlugin);

activitySchema.statics.build = (attrs: ActivityAttrs) => {
  return new Activity(attrs);
};

const Activity = mongoose.model<ActivityDoc, ActivityModel>(
  'Activity',
  activitySchema
);

export { Activity };
