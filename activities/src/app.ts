import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import path from 'path';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@zecamact/common';

import { createActivityRouter } from './routers/new';
import { showActivityRouter } from './routers/show';
import { indexActivityRouter } from './routers/index';
import { updateActivityRouter } from './routers/update';
import { deleteActivityRouter } from './routers/delete';
import { uploadPictureRouter } from './routers/upload';
import { deletePictureRouter } from './routers/unlink';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);
app.use(createActivityRouter);
app.use(showActivityRouter);
app.use(indexActivityRouter);
app.use(updateActivityRouter);
app.use(deleteActivityRouter);
app.use(uploadPictureRouter);
const abspath = path.join(__dirname, 'uploads');
console.log(abspath);
app.use('/api/activities/uploads', express.static(abspath));
app.use(deletePictureRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
