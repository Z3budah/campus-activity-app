import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequests, RegStatus, BadRequestError, DatabaseConnectionError } from '@zecamact/common';
import { body } from 'express-validator';
import { Activity } from '../model/activity';
import { Registration } from '../model/registration';

const router = express.Router();
const EXPIRATION_WINDOWS_SECONDS = 15 * 60;

router.post('/api/regs', requireAuth,
  [
    body('activityId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ActivityId must be provided'),
  ],
  validateRequests,
  async (req: Request, res: Response) => {
    const { activityId } = req.body;
    // Find the activity the user is trying to register in the database
    const activity = await Activity.findById(activityId);
    if (!activity) {
      throw new NotFoundError();
    }

    const isAvailable = await activity.isAvailable();
    if (!isAvailable) {
      throw new BadRequestError('Activity is not available');
    }

    // Caculate an expiration date for this registration
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    // Build the order and save it to the database
    const registration = Registration.build({
      userId: req.currentUser!.id,
      status: RegStatus.Created,
      expiresAt: expiration,
      activity
    });
    await registration.save()
      // .then(save => {
      //   console.log('succefully saved', save);
      // })
      .catch(err => {
        console.log(err);
        throw new DatabaseConnectionError();
      })

    // Publish an event saying that an order was created
    res.status(201).send(registration);
  });

export { router as newRegRouter };