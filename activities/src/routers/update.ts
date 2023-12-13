import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  validateRequests,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@zecamact/common';
import { Activity } from '../model/activities';
import { ActivityUpdatedPublisher } from '../events/publishers/activity-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/activities/:id',
  requireAuth,
  validateRequests,
  async (req: Request, res: Response) => {
    // validation 
    if (req.body.title !== undefined) {
      await body('title').not().isEmpty().withMessage('Title is required').run(req);
    }
    if (req.body.state !== undefined) {
      await body('state').isInt({ min: 0, max: 4 }).withMessage('State must be an integer between 0 and 4').run(req);
    }
    const errors = validationResult(req);

    // console.log(errors.array()); // Log the array of errors

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /*================================================================================================================*/
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      throw new NotFoundError();
    }

    if (activity.pubId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const allowedFields = ['title', 'description', 'time', 'location', 'actype', 'score', 'capacity', 'state'];

    activity.set(
      allowedFields.reduce((update: any, field) => {
        if (req.body[field] !== undefined) {
          update[field] = req.body[field];
          // console.log(req.body[field], update[field]);
        }
        return update;
      }, {})
    );

    await activity.save();
    new ActivityUpdatedPublisher(natsWrapper.client).publish({
      title: activity.title,
      description: activity.description,
      time: activity.time,
      location: activity.location,
      actype: activity.actype,
      score: activity.score,
      capacity: activity.capacity,
      pubId: activity.pubId,
      state: activity.state
    })

    res.send(activity);
  }
);

export { router as updateActivityRouter };
