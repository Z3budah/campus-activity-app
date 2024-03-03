import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { currentUser, requireAuth, BadRequestError, validateRequests } from '@zecamact/common';

import { User } from '../model/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/change-password',
  currentUser,
  requireAuth,
  [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('New password must be between 4 and 20 characters')
  ],
  validateRequests,
  async (req: Request, res: Response) => {
    console.log('change pwd router');
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);
    const existingUser = await User.findById(req.currentUser!.id);

    if (!existingUser) {
      throw new BadRequestError('User not exist');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      oldPassword
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid old password');
    }

    existingUser.password = newPassword;
    await existingUser.save();

    res.status(200).send(existingUser);
  }
);

export { router as changePasswordRouter };
