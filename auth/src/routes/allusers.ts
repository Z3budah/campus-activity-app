import express from 'express';

import { currentUser } from '@zecamact/common';
import { User } from '../model/user';
const router = express.Router();

router.get('/api/users/allusers', currentUser, async (req, res) => {
  //eg: https://campus-activity.dev/api/users/allusers?role=publisher
  const { role } = req.query;
  const queryObject: any = {};

  if (role) {
    queryObject.role = role;
  }
  const users = await User.find(queryObject);
  res.send(users);
});

export { router as allUserRouter };
