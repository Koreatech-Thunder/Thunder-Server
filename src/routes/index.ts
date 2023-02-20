//router index file
import { Router } from 'express';
import UserRouter from "./UserRouter";
import ThunderRouter from "./ThunderRouter";
import AuthRouter from "./AuthRouter";


const router: Router = Router();

router.use('/user', UserRouter);
router.use('/thunder', ThunderRouter);
router.use('/auth', AuthRouter);


export default router;