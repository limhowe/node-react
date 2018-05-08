import { Router } from 'express';
import { getProfile, read, update } from '../controllers/user.controller';

const router = new Router();

router.use(getProfile);

router.route('/me')
  .get(read)
  .post(update);

export default router;
