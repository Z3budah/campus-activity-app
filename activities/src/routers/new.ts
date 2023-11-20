import express, {Request, Response} from "express";
import { body } from "express-validator";
import { requireAuth, validateRequests } from "@zecamact/common";

import { Activity } from "../model/activities";

const router = express.Router();

router.post('/api/activities',requireAuth,[
  body('title')
  .not()
  .isEmpty()
  .withMessage('Title is required')
],
validateRequests,
async (req:Request, res: Response)=>{
  const {title,description,time,location,actype,score,capacity,state } = req.body;
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
  res.status(201).send(activity);
})

export {router as createActivityRouter}
