import express from 'express';

import { currentUser } from '@zecamact/common';
const router = express.Router();

router.get('/api/users/allusers', currentUser, (req, res) => {

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
