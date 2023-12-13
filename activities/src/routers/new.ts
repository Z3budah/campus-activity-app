import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequests } from "@zecamact/common";

import { Activity } from "../model/activities";
import { ActivityCreatedPublisher } from "../events/publishers/activity-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post('/api/activities', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required')
],
  validateRequests,
  async (req: Request, res: Response) => {
    const { title, description, time, location, actype, score, capacity, state } = req.body;
    const activity = Activity.build({
      title,
      description,
      time,
      location,
      actype,
      score,
      capacity,
      pubId: req.currentUser!.id,
      state
    });

    await activity.save();
    new ActivityCreatedPublisher(natsWrapper.client).publish({
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

    res.status(201).send(activity);
  })

export { router as createActivityRouter }
