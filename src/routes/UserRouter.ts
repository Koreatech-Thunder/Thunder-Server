import {Router} from 'express';
import UserController from '../controllers/user/UserController';

const router: Router = Router();

router.get('/profile/:userId', UserController.getUserForProfileUpdate);

export default router;
