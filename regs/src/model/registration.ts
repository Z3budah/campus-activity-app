import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { RegStatus } from '@zecamact/common'
import { ActivityDoc } from './activity'

interface RegAttrs {
  userId: string,
  status: RegStatus,
  expiresAt: Date,
  activity: ActivityDoc,
}

interface RegDoc extends mongoose.Document {
  userId: string,
  status: RegStatus,
  expiresAt: Date,
  activity: ActivityDoc,
  version: number;
}

interface RegModel extends mongoose.Model<RegDoc> {
  build(attrs: RegAttrs): RegDoc;
}

const regSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(RegStatus),
    default: RegStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

regSchema.set('versionKey', 'version');
regSchema.plugin(updateIfCurrentPlugin);

regSchema.statics.build = (attrs: RegAttrs) => {
  return new Registration(attrs);
};

const Registration = mongoose.model<RegDoc, RegModel>('Registration', regSchema);

export { Registration };
