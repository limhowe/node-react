import { Router } from 'express';
import { create, update, read, list, remove, getUserByID } from '../controllers/user.controller';
import ROLES from '../constants/role';
import policies from '../policies';

const router = new Router();

router.use(policies.checkRoles([ROLES.ADMIN, ROLES.MANAGER]));

router.route('/')
  .get(list)
  .post(create);

router.route('/:userId')
  .get(read)
  .put(update)
  .delete(remove);

router.param('userId', getUserByID);

export default router;
