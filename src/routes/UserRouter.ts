import {Router} from 'express';
import UserController from '../controllers/user/UserController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.put('', auth.auth, UserController.updateUser);
router.get('/:userId', UserController.findUserById);
router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);
router.get('/hashtags', auth.auth, UserController.findUserHashtag);

export default router;
