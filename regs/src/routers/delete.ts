import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, RegStatus, requireAuth } from '@zecamact/common';
import { Registration } from '../model/registration';
import { RegCancelledPublisher } from '../events/publishers/reg-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/regs/:regId', requireAuth, async (req: Request, res: Response) => {
  const reg = await Registration.findById(req.params.regId).populate('activity');
  if (!reg) {
    throw new NotFoundError();
  }

  if (reg.userId != req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  reg.set({ status: RegStatus.Cancelled });
  await reg.save();

  new RegCancelledPublisher(natsWrapper.client).publish({
    id: reg.id,
    userId: reg.userId,
    activity: {
      id: reg.activity.id,
    },
  });

  res.status(204).send(reg);
});

export { router as deleteRegRouter };