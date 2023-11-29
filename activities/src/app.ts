import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser} from '@zecamact/common';

import { createActivityRouter } from './routers/new';
import { showActivityRouter } from './routers/show';
import { indexActivityRouter } from './routers/index';
import { updateActivityRouter } from './routers/update';
import { deleteActivityRouter } from './routers/delete';

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

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
