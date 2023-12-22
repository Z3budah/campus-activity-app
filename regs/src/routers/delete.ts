import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, RegStatus, requireAuth } from '@zecamact/common';
import { Registration } from '../model/registration';

const router = express.Router();

router.delete('/api/regs/:regId', requireAuth, async (req: Request, res: Response) => {
  const reg = await Registration.findById(req.params.regId);
  if (!reg) {
    throw new NotFoundError();
  }

  if (reg.userId != req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  reg.set({ status: RegStatus.Cancelled });
  await reg.save();

  res.status(204).send(reg);
});

export { router as deleteRegRouter };