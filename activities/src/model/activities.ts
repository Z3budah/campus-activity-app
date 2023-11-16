import mongoose, { Schema } from "mongoose";

enum ActivityType {
  Moral= "moral",
  Intellectual="intellectual",
  Culsport= "culsport",
}

interface ActivityAttrs{
  title: string;
  description:string;
  date: Date;
  actype: ActivityType;
  score:number|string;
  capacity: number|string;
  userId: string;
}

interface ActivityDoc extends mongoose.Document{
  title: string;
  description:string;
  date: Date;
  actype: ActivityType;
  score:number|string;
  capacity: number|string;
  userId: string;
}

interface ActivityModel extends mongoose.Model<ActivityDoc>{
  build(attrs: ActivityAttrs): ActivityDoc;
}

const activitySchema = new mongoose.Schema({
  title:{
    type:String,
    required: true,
  },
  description:{
    type:String
  },
  date:{
    type:Date,
    required: true
  },
  actype:{
    type: String, 
    enum: Object.values(ActivityType),
    required:true
  },
  score:{
    type:Schema.Types.Mixed
  },
  capacity:{
    type:Schema.Types.Mixed
  },
  userId:{
    type: String,
    required: true
  }
},{
  toJSON:{
    transform(doc,ret){
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

activitySchema.statics.build = (attrs: ActivityAttrs)=>{
  return new Activity(attrs);
}

const Activity = mongoose.model<ActivityDoc, ActivityModel>('Activity',activitySchema);

export {Activity};

