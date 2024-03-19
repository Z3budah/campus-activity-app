import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequests, BadRequestError, currentUser, requireAuth, NotAuthorizedError } from '@zecamact/common'

import { User } from '../model/user';
import { Student } from '../model/student';


const router = express.Router();

const allowedRoles = ['publisher', 'admin', 'student'];

router.post('/api/users/create',
  currentUser,
  requireAuth,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must between 4 and 20 characters'),
    body('role').notEmpty().withMessage('Role must be selected'),
  ],
  validateRequests,
  async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (req.currentUser?.role !== "admin") {
      throw new NotAuthorizedError();
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in Use');
    }

    const user = User.build({ email, password, role });
    await user.save();

    if (role === 'student') {
      const { name, phone } = req.body;
      const student = new Student({
        userId: user.id,
        name: name,
        phone: phone
      });
      await student.save();
    };

    res.status(200).send(user);
  });

export { router as createUserRouter };
