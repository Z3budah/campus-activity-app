import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@zecamact/common';

import { newRegRouter } from './routers/new';
import { showRegRouter } from './routers/show';
import { indexRegRouter } from './routers/index';
import { deleteRegRouter } from './routers/delete';

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
app.use(newRegRouter);
app.use(showRegRouter);
app.use(indexRegRouter);
app.use(deleteRegRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
