import { Router } from 'express';
import expressJwt from 'express-jwt';
import config from '../../config';

import authRoute from './auth.route';
import userRoute from './user.route';
import profileRoute from './profile.route';

const router = new Router();

const authMiddleware = expressJwt({ secret: config.jwtSecret });

router.use('/auth', authRoute);
router.use('/users', authMiddleware, userRoute);
router.use('/profile', authMiddleware, profileRoute);

export default router;
