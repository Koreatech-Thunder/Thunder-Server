//router index file
import { Router } from 'express';
import UserController from '../controllers/UserController';

const router: Router = Router();

router.put('/', UserController.createUser);

export default router;
