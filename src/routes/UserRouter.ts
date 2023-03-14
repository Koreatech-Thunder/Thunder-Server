import {Router} from 'express';
import UserController from '../controllers/user/UserController';

const router: Router = Router();

router.get('/profile/:userId', UserController.getUserForProfileUpdate);
router.get('/hashtags/:userId', UserController.findUserHashtag);
router.put('/:userId', UserController.updateUser);

export default router;
