import express, {Request, Response} from "express";
import { body } from "express-validator";
import { requireAuth, validateRequests } from "@zecamact/common";

import { Activity } from "../model/activities";

const router = express.Router();

router.post('/api/activities',requireAuth,[
  body('title')
  .not()
  .isEmpty()
  .withMessage('Title is required'),
  body('capacity ')
  .isInt({gt:0})
  .withMessage("Capacity must be greater than 0")
],
validateRequests,
async (req:Request, res: Response)=>{

  const {title,description,date,actype,score,capacity } = req.body;

  const activity = Activity.build({
    title,
    description,
    date,
    actype,
    score,
    capacity,
    userId: req.currentUser!.id
  });

  await activity.save();

  res.sendStatus(201).send(activity);
})

export {router as createActivityRouter}
