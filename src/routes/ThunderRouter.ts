//router index file
import {Router} from 'express';
import {query} from 'express-validator/check';
import ThunderController from '../controllers/thunder/ThunderController';

const router: Router = Router();

router.post('/:userId', ThunderController.createThunder);
router.get('/:userId', ThunderController.findThunderAll);
router.get(
  '/:userId/hashtags',
  [query('hashtag').isString()],
  ThunderController.findThunderByHashtag,
);

export default router;
