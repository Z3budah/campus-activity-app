import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequests, BadRequestError } from '@zecamact/common'

import { User } from '../model/user';


const router = express.Router();

const allowedRoles = ['publisher', 'user'];

router.post('/api/users/signup',
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
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in Use');
    }

    const user = User.build({ email, password, role });
    await user.save();

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY!);

    // store it on session
    req.session = {
      jwt: userJwt
    };
    res.status(200).send(user);
  });

export { router as signupRouter };
