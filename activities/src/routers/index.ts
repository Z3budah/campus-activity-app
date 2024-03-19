import express, { Request, Response } from 'express';
import { Activity } from '../model/activities';

const router = express.Router();

interface QueryParams {
  limit?: number;
  page?: number;
  state?: number;
  pubId?: string;
}

router.get('/api/activities', async (req: Request, res: Response) => {
  const { limit, page, state, pub } = req.query;

  const queryObject: QueryParams = {};
  if (state) {
    queryObject.state = parseInt(state as string, 10);
  }

  if (req.currentUser && req.currentUser.role === 'publisher') {
    queryObject.pubId = req.currentUser!.id;
  }
  if (pub) {
    queryObject.pubId = pub.toString();
  }

  const activities = await Activity.find(queryObject);

  res.send(activities);
});

export { router as indexActivityRouter };
