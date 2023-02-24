//router index file
import {Router} from 'express';
import {query} from 'express-validator/check';
import ThunderController from '../controllers/ThunderController';

const router: Router = Router();

router.post('/:userId', ThunderController.createThunder);
router.get('/', ThunderController.findThunderAll);
router.get(
  '/hashtags',
  [query('hashtag').isString()],
  ThunderController.findThunderByHashtag,
);

export default router;
