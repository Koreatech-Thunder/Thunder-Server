import {Router} from 'express';
import UserController from '../controllers/user/UserController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get('/hashtags', auth.auth, UserController.findUserHashtag);
router.get('/record', auth.auth, UserController.findUserThunderRecord);
router.get('/alarm', auth.auth, UserController.findUserAlarmState);
router.put('/', auth.auth, UserController.updateUser);
router.get('/:userId', UserController.findUserById);
router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);

export default router;
