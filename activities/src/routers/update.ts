import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {   
  validateRequests,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,} from '@zecamact/common';
import { Activity } from '../model/activities';

const router = express.Router();

router.put(
  '/api/activities/:id',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequests,
  async (req: Request, res: Response) => {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      throw new NotFoundError();
    }

    if (activity.pubId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const allowedFields = ['title', 'description', 'time', 'location', 'actype', 'score', 'capacity','state'];

    activity.set(
      allowedFields.reduce((update:any, field) => {
        if (req.body[field] !== undefined) {
          update[field] = req.body[field];
        }
        return update;
      }, {})
    );

    await activity.save();

    res.send(activity);
  }
);

export { router as updateActivityRouter };
