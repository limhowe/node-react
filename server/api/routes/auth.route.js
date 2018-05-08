import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller';
require('express-async-errors');

const router = new Router();
router.route('/login')
  .post(login);

router.route('/signup')
  .post(signup);

export default router;
