//router index file
import {Router} from 'express';
import UserController from '../controllers/UserController';

const router: Router = Router();

router.put('/:userId', UserController.createUser);
router.get('/hashtags/:userId', UserController.findUserHashtag);

export default router;
