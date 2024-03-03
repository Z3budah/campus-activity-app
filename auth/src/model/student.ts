import mongoose from "mongoose";

// properties
interface StuAttrs {
  userId: string;
  name: string;
  phone: string;
  pic: string;
}

interface StuModel extends mongoose.Model<StuDoc> {
  build(attrs: StuAttrs): StuDoc;
}

interface StuDoc extends mongoose.Document {
  userId: string;
  name: string;
  phone: string;
  pic: string;
}

const stuSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  pic: {
    type: String,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});



stuSchema.statics.build = (attrs: StuAttrs) => {
  return new Student(attrs);
}

const Student = mongoose.model<StuDoc, StuModel>('Student', stuSchema);


export { Student };