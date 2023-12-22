import express, { Request, Response } from 'express';
import { requireAuth } from '@zecamact/common';
import { Registration } from '../model/registration';

const router = express.Router();

router.get('/api/regs', requireAuth, async (req: Request, res: Response) => {
  const regs = await Registration.find({
    userId: req.currentUser!.id
  }).populate('activity');

  res.send(regs);
});

export { router as indexRegRouter };