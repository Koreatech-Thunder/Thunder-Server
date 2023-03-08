import {Router} from 'express';
import UserRouter from './UserRouter';
import ThunderRouter from './ThunderRouter';

const router: Router = Router();

router.use('/user', UserRouter);
router.use('/thunder', ThunderRouter);

export default router;
