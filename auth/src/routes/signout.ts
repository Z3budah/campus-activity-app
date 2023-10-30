import express from 'express';
import { currentUser, requireAuth } from '@zecamact/common';

const router = express.Router();

router.post('/api/users/signout',currentUser,requireAuth, (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
