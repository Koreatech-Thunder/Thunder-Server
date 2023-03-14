import {Router} from 'express';
import UserController from '../controllers/user/UserController';

const router: Router = Router();

router.put('/:userId', UserController.updateUser);
router.get('/:userId', UserController.findUserById);
router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);
router.get('/hashtags/:userId', UserController.findUserHashtag);

export default router;
