import {Router} from 'express';
import {UserController} from '../controllers';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get('/hashtags', auth.auth, UserController.findUserHashtag);
router.get('/profile', auth.auth, UserController.getUserForProfileUpdate);
router.get('/', auth.auth, UserController.findUserById);
router.delete('/', auth.auth, UserController.deleteUser);
router.get('/profile', auth.auth, UserController.getUserForProfileUpdate);

export default router;
