import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@zecamact/common';
import { Registration } from '../model/registration';

const router = express.Router();

router.get('/api/regs/:regId', requireAuth, async (req: Request, res: Response) => {
  const reg = await Registration.findById(req.params.regId).populate('activity');

  if (!reg) {
    throw new NotFoundError();
  }

  if (reg.userId != req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(reg);
});

export { router as showRegRouter };