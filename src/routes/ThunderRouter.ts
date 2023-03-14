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

export default router;
