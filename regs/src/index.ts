import mongoose, { ConnectOptions } from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { ActivityCreatedListener } from './events/listeners/activity-created-listener';
import { ActivityUpdatedListener } from './events/listeners/activity-updated-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL);
      natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
      });

      process.on('SIGINT', () => { natsWrapper.client.close() });
      process.on('SIGTERM', () => { natsWrapper.client.close() });

      new ActivityCreatedListener(natsWrapper.client).listen();
      new ActivityUpdatedListener(natsWrapper.client).listen();

      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
      break;
    } catch (err) {
      console.log(`Error during MongoDB connection attempt ${retries + 1}:`, err);
      // Unregister Stan client if it was previously registered
      if (natsWrapper.client) {
        natsWrapper.client.close();
        console.log('Stan client unregistered');
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }


};

app.listen(3000, () => {
  console.log('Listening on port 3000!!');
});

start();
