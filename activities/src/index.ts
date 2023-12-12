import mongoose,{ ConnectOptions } from 'mongoose';

import {app} from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  const maxRetries = 5;
  let retries = 0;

  while(retries<maxRetries){
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
      break;
    } catch (err) {
      console.log(`Error during MongoDB connection attempt ${retries + 1}:`,err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (retries === maxRetries) {
    console.error('Failed to connect to MongoDB after maximum retries. Exiting...');
    process.exit(1);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!!');
});

start();
