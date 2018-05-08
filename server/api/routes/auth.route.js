import { Router } from 'express';
import { login, signup, forgot } from '../controllers/auth.controller';

const router = new Router();
router.route('/login')
  .post(login);

router.route('/signup')
  .post(signup);

router.route('/forgot')
  .post(forgot);

export default router;
