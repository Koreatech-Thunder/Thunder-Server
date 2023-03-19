//router index file
import {Router} from 'express';
import UserRouter from './UserRouter';
import AuthRouter from './AuthRouter';
import ChatRouter from './ChatRouter';

const router: Router = Router();

router.use('/user', UserRouter);
router.use('/auth', AuthRouter);
router.use('/chat', ChatRouter);

export default router;
