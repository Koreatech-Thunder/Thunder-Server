import {Router} from 'express';
import UserController from '../controllers/user/UserController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get('/record/', auth.auth, UserController.findUserThunderRecord);
router.get('/profile', auth.auth, UserController.getUserForProfileUpdate);
router.get('/hashtags', auth.auth, UserController.findUserHashtag);
router.get('/alarm', auth.auth, UserController.findUserAlarmState);
router.put('/', auth.auth, UserController.updateUser);
router.get('/', auth.auth, UserController.findUserById);
router.delete('/', auth.auth, UserController.deleteUser);

export default router;
