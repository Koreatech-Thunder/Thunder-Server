//router index file
import {Router} from 'express';
import {query} from 'express-validator/check';
import ThunderController from '../controllers/thunder/ThunderController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.post('/:userId', auth.auth, ThunderController.createThunder);
router.get('/:userId', auth.auth, ThunderController.findThunderAll);
router.get(
  '/:userId/hashtags',
  auth.auth,
  [query('hashtag').isString()],
  ThunderController.findThunderByHashtag,
);
router.get('/:userId/:thunderId', auth.auth, ThunderController.findThunder);
router.put('/:userId/:thunderId', ThunderController.updateThunder);
router.put('/join/:userId/:thunderId', ThunderController.joinThunder);
router.put('/out/:userId/:thunderId', ThunderController.outThunder);

export default router;
