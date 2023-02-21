//router index file
import {Router} from 'express';
import ThunderController from '../controllers/ThunderController';

const router: Router = Router();

router.post('/:userId', ThunderController.createThunder);
router.get('/', ThunderController.findThunderAll);

export default router;
