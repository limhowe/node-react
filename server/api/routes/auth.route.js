import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller';

const router = new Router();
router.route('/login')
  .post(login);

router.route('/signup')
  .post(signup);

export default router;
