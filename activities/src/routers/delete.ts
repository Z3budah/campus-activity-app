import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {   
  validateRequests,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  DatabaseConnectionError,} from '@zecamact/common';
import { Activity } from '../model/activities';

const router = express.Router();

router.delete(
  '/api/activities/:id',
  requireAuth,
  validateRequests,
  async (req: Request, res: Response) => {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      throw new NotFoundError();
    }

    if (activity.pubId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const result = await Activity.findByIdAndDelete(req.params.id);
    if(!result){
      throw new DatabaseConnectionError();
    }
    res.send(activity);
  }
);
export { router as deleteActivityRouter }