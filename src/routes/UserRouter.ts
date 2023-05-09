import {Router} from 'express';
import UserController from '../controllers/user/UserController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get('/record/', auth.auth, UserController.getThunderRecord);
router.get('/profile', auth.auth, UserController.getUserForProfileUpdate);
router.get('/hashtags', auth.auth, UserController.getUserHashtag);
router.get('/alarm', auth.auth, UserController.getUserAlarmState);
router.put('/', auth.auth, UserController.updateUser);
router.get('/', auth.auth, UserController.getUserById);
router.delete('/', auth.auth, UserController.deleteUser);

export default router;
