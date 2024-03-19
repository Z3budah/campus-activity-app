import express, { Request, Response } from 'express';

import { currentUser, requireAuth, DatabaseConnectionError, validateRequests, NotAuthorizedError, NotFoundError } from '@zecamact/common';

import { User } from '../model/user';

const router = express.Router();

router.delete(
  '/api/users/:id',
  currentUser,
  requireAuth,
  validateRequests,
  async (req: Request, res: Response) => {
    console.log('delete user router');
    if (req.currentUser!.role !== "admin") {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError();
    }

    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      throw new DatabaseConnectionError();
    }
    res.send(user);
  }
);
export { router as deleteUserRouter }