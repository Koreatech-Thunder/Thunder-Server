//router index file
import {Router} from 'express';
import ThunderController from '../controllers/ThunderController';

const router: Router = Router();

router.post('/:userId', ThunderController.createThunder);

export default router;
